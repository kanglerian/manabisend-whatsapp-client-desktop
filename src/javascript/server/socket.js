let socket;
let parsedData;
let server;

const socketSetup = () => {
  server = localStorage.getItem('server');

  if (server) {
    const accounts = localStorage.getItem('accounts');
    parsedData = JSON.parse(accounts);

    if(parsedData){
      requestAccess(parsedData.code);
    }

    socket = io(server);

    $('#url-container').hide();
    $('#sent-percent-container').hide();
    $('#sent-container').hide();
    $('#percent-container').hide();

    socket.on('connect', () => {
      let icon = '<i class="fa-solid fa-server mr-1"></i>'
      let text = '<span class="text-xs">Terhubung ke server.</span>'
      $('#chat-container').removeClass('from-[#ef4444] to-[#dc2626]')
        .addClass('from-[#25D366] to-[#1CA653]');
      $('#signal').css('display', 'block').html(`<span>${icon} ${text}</span>`);
      $('#loading-container').show();
      getUser();
    });

    socket.on('api', (data) => {
      localStorage.setItem('api', data);
    });

    socket.on('percent', (data) => {
      let persen = (data.counter / data.length) * 100;
      $('#percent').text(`${persen.toFixed()}%`);
      $('#percent').attr('style', `width: ${persen}%`);
      $('#sent-percent-container').show();
      $('#percent-container').show();
    })

    socket.on('connect_error', () => {
      let icon = '<i class="fa-solid fa-server mr-1"></i>'
      let text = '<span class="text-xs">Gagal terhubung ke server.</span>'
      $('#chat-container').removeClass('from-[#25D366] to-[#1CA653]').addClass('from-[#ef4444] to-[#dc2626]');
      $('#signal').css('display', 'block').html(`<span>${icon} ${text}</span>`);
      $('#qrcode-container').hide();
      $('#loading-container').show();
      $('#authentication-container').show();
      $('#message-container').hide();
      $('#history-container').hide();
      $('#identity-container').hide();
      $('#info-container').removeClass('h-2/6').addClass('h-full');
      $('#logging').text('');
    });

    socket.on('qrcodeval', (qrcode) => {
      $('#qrcode').attr('src', qrcode);
      $('#qrcode-container').show();
      $('#loading-container').hide();
    })

    socket.on('ready', () => {
      $('#qrcode-container').hide();
      getUser();
      setTimeout(() => {
        getData();
      }, 1000);
    });

    socket.on('info', (info) => {
      getHistory();
      $('#sent-percent-container').show();
      $('#sent-container').show();
      const statusColors = {
        1: "text-red-500",
        2: "text-amber-500",
        3: "text-emerald-500",
      };
      const fontColor = statusColors[info.status] || "text-gray-500";
      const infoContainer = `<p class="w-1/2 text-center rounded-xl ${fontColor} bg-white mb-3 px-5 py-2 drop-shadow text-xs font-medium"></i> ${info.message}</p>`;

      $('#sent-container').html(infoContainer);
    });

    socket.on('stop', () => {
      stopFlag = true
    });

    socket.on('logging', (log) => {
      $('#logging').text(log);
    });

    const getHistory = () => {
      socket.emit('getHistory', true);
      socket.on('histories', (data) => {
        localStorage.setItem('histories', JSON.stringify(data));
        let bucket = '';
        if (data.length > 0) {
          data.forEach((contact, i) => {
            bucket += `
          <tr>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${i + 1}</th>
            <td class="px-6 py-4">${contact.name}</td>
            <td class="px-6 py-4">${contact.phone}</td>
            <td class="px-6 py-4">${contact.status == 1 ? `<i class="text-emerald-600 fas fa-check-circle"></i>` : '<i class="text-red-600 fas fa-circle-xmark"></i>'}</td>
          </tr>
        `
          });
        } else {
          bucket += `<tr><td class="px-6 py-4 text-gray-400 font-medium" colspan="4">Data Riwayat Belum Tersedia.</td></tr>`
        }
        $('#history').html(bucket);
        const historyTable = document.getElementById('history-table-container');
        if (historyTable) {
          historyTable.parentElement.scrollTop = historyTable.parentElement.scrollHeight;
        }
      });
    }

    const getUser = () => {
      socket.emit('getUsers', true);
      socket.on('users', (data) => {
        localStorage.setItem('accounts', JSON.stringify(data));
        let code = data.code;
        if (code) {
          $('#identity-container').hide();
          if (data.status == 1) {
            $('#authentication-container').hide();
            $('#loading-container').hide();
            $('#message-container').show();
            $('#history-container').show();
            $('#info-container').removeClass('h-full').addClass('h-2/6');
          } else {
            $('#authentication-container').show();
            $('#loading-container').show();
            $('#message-container').hide();
            $('#qrcode-container').hide();
            $('#history-container').hide();
            $('#info-container').removeClass('h-2/6').addClass('h-full');
            console.log('tutup qrcode');
          }
        } else {
          $('#qrcode-container').hide();
          $('#identity-container').show();
          $('#qrcode-container').hide();
          $('#history-container').hide();
          $('#info-container').removeClass('h-2/6').addClass('h-full');
        }
      });
    }

    getUser();
    getHistory();

  } else {
    $('#identity-container').hide();
    $('#qrcode-container').hide();
    $('#history-container').hide();
    $('#sent-percent-container').hide();
    $('#info-container').removeClass('h-2/6').addClass('h-full');
    $('#chat-container').removeClass('from-[#25D366] to-[#1CA653]').addClass('from-[#ef4444] to-[#dc2626]');
    $('#logging').text('');
  }
}