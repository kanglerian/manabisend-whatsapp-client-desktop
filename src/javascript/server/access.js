const requestAccess = async (code) => {
  await axios.get(`https://manabisend-access.vercel.app/users/${code}`)
    .then((response) => {
      if (response.status == 200) {
        $('#button-access').attr('type', 'submit');
        $('#button-access').html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Send Messages</span>`);
      }
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          $("#button-access").attr("type", "button");
          $("#button-access").html(`
            <a href="http://saweria.co/kanglerian" target="_blank">
              <i class="fa-solid fa-lock mr-1"></i>
              <span>Akses terkunci</span>, bayarin ngopi dulu, baru lanjut! 😆
            </a>`);
        } else if (error.response.status === 403) {
          $("#button-access").attr("type", "submit");
          $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
        } else if (error.response.status === 401) {
          $("#button-access").attr("type", "submit");
          $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
        } else if (error.response.status === 429) {
          $("#button-access").attr("type", "submit");
          $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
        } else if (error.response.status >= 500) {
          $("#button-access").attr("type", "submit");
          $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
        } else {
          $("#button-access").attr("type", "submit");
          $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
        }
      } else if (error.request) {
        $("#button-access").attr("type", "submit");
        $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
      } else if (error.message.includes("Network Error")) {
        $("#button-access").attr("type", "submit");
        $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
      } else {
        $("#button-access").attr("type", "submit");
        $("#button-access").html(`<i class="fa-solid fa-paper-plane mr-1"></i><span>Kirim</span>`);
      }
    });
}