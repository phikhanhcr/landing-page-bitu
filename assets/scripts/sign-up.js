
const SIGN_UP_FILE_PROPS = {
  maxSizeVideo: 157286400,
  maxSizeDocument: 26214400,
};
const SIGN_UP = {
  files: {
    'ipt-intro': '',
    'ipt-cv': '',
    'ipt-cert': '',
  },
  validationObject: {
    name: {
      id: "ipt-name",
      display: "Name",
      required: true,
      regex: /^[^0-9`~!@#$%^&*()+=\[\]{}\\|;':"<>?\/]+$/g,
      format: 'Non-numeric, whitespace or characters: ._- only',
      maxlength: 128,
    },
    yob: {
      id: "ipt-yob",
      display: "Year of birth",
      required: true,
    },
    nationality: {
      id: "ipt-nationality",
      display: "Nationality",
      required: true,
    },
    email: {
      id: "ipt-email",
      display: "Email",
      required: true,
      regex: /^[^@]+@[^@]+$/g,
      format: 'Email only',
    },
    intro: {
      id: "ipt-intro",
      display: "Intro Audio/Video",
      required: true,
      type: 'file',
      extensions: ['.wmv', '.m4r', '.mp4', '.3gpp', '.mpeg', '.mpeg4', 'application/octet-stream', '.mov', '.webm', '.mp3', '.wav'],
      maxSize: SIGN_UP_FILE_PROPS.maxSizeVideo,
      selectType: 'Single'
    },
    telegram: {
      id: "ipt-telegram",
      display: "Telegram contact",
      required: true,
      regex: /^\+?[0-9]{8,15}$/g,
      format: 'Numeric, length: 8-15 digits.',
      maxlength: 16,
      minlength: 8
    },
    cv: {
      id: "ipt-cv",
      display: "Curriculum Vitae",
      required: true,
      type: 'file',
      extensions: ['.jpg', '.png', '.jpeg', '.pdf', '.docx', '.doc', '.xlsx', '.xls'],
      maxSize: SIGN_UP_FILE_PROPS.maxSizeDocument,
      selectType: 'Multiple'
    },
    cert: {
      id: "ipt-cert",
      display: "Certificates",
      type: 'file',
      extensions: ['.jpg', '.png', '.jpeg', '.pdf', '.docx', '.doc', '.xlsx', '.xls'],
      maxSize: SIGN_UP_FILE_PROPS.maxSizeDocument,
      selectType: 'Multiple'
    },
  },

  getFileExtension: function (fileName) {
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
  },

  getFileSize: function (number) {
    if (number < 1024) {
      return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + 'MB';
    }
  },

  init: function () {
    const _this = this;

    api.getCountries().done(function (res) {
      if (res && res.error_code == 0 && res.data) {
        const data = res.data;
        data.forEach((d) => {
          $("#ipt-nationality").append(
            $("<option>", {
              value: d.code,
              text: `${d.emoji} ${d.name}`,
            })
          );
        });
      }
    });
  },

  onHandleFileUpload: function (value) {
    const id = `#${value.id}`;
    const preview_id = `#${value.id}__preview`;
    const files = $(id).prop('files');
    if (files.length === 0) {
      $(preview_id).html(`<div>No files currently selected for upload (${value.selectType})</div>`);
      return;
    }
    $(preview_id).html('');
    for (const file of files) {
      let msg = ''
      if (value.maxSize && file.size > value.maxSize) {
        console.log({ value }, 123123)
        msg = `${file.name}, file size ${this.getFileSize(file.size)}: <span class='text-red'>File size exceeds ${this.getFileSize(value.maxSize)}.</span>`;
        this.files[value.id] = 'maxSize'
      } else if (!this.getFileExtension(file.name) || value.extensions.includes(this.getFileExtension(file.name))) {
        msg = `${file.name}: <span class='text-red'>Invalid file type.</span>`;
        this.files[value.id] = 'extensions'
      } else {
        msg = `${file.name}, file size ${this.getFileSize(file.size)}.`;
      }
      $(preview_id).append(`<span>${msg}</span>`);
    }
  },

  validateField: function (value) {
    if (value && value.id) {
      const id = value.id;
      if (value.type === 'file') {
        this.onHandleFileUpload(value);
        if (value.maxSize && this.files[id] === 'maxSize') {
          $(`#${id}-validation`).html(`File size exceeds ${this.getFileSize(value.maxSize)}`);
          document.getElementById(id).setCustomValidity(`ExceedsMaxSize`);
          $(`#${id}-validation`).show();
          return false;
        }
        if (value.extensions && value.extensions.length > 0 && this.files[id] === 'extensions') {
          $(`#${id}-validation`).html('Invalid file type');
          document.getElementById(id).setCustomValidity(`InvalidExtensions`);
          $(`#${id}-validation`).show();
          console.log("456")
          return false;
        }
      }
      if (value.required && !$(`#${id}`).val()) {
        $(`#${id}-validation`).html(`${value.display} is required`);
        document.getElementById(id).setCustomValidity(`Required`);
        if (value.type === 'file') {
          $(`#${id}-validation`).show();
        }
        return false;
      }
      if (value.maxlength && $(`#${id}`).val().length > value.maxlength) {
        $(`#${id}-validation`).html(`${value.display} exceeds max length of ${value.maxlength} characters`);
        document.getElementById(id).setCustomValidity(`InputTooLong`);
        return false;
      }
      const regex = new RegExp(value.regex);
      if (value.regex && !regex.test($(`#${id}`).val())) {
        $(`#${id}-validation`).html(`Invalid ${value.display}. Allowed format: ${value.format}`);
        document.getElementById(id).setCustomValidity(`NotMatchRegex`);
        return false;

      }
      return true;
    }
  },

  onValidateField: function (value) {
    if (this.validateField(value)) {
      $(`#${value.id}-validation`).html("");
      document.getElementById(value.id).setCustomValidity("");
      $(`#${value.id}-validation`).hide();
      if (value.type === 'file') {
      }
    }
  },

  callSubmitAPI: function (data) {
    const req = {
      name: $('#ipt-name').val().trim(),
      birth_year: new Date($('#ipt-yob').val()),
      nationality: $('#ipt-nationality').val(),
      email: $('#ipt-email').val(),
      intro_url: data.intro_url,
      telegram_contact: $('#ipt-telegram').val(),
      curriculum_vitae_urls: data.curriculum_vitae_urls,
      certificate_urls: data.certificate_urls,
    }
    console.log({ req })
    api.postRegisterMod(req).done((res) => {
      if (res && res.error_code == 0) {
        Swal.fire({
          title: 'Success',
          text: 'Submit successfully!',
          icon: 'success',
          confirmButtonText: 'Back to Home'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/'
          }
        })
      } else {
        Swal.fire({
          title: 'Error',
          text: 'An unexpected error has been occurred. Please retry.',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      }
    }).fail((err) => {
      if (err && err.responseJSON && err.responseJSON.message) {
        const error = err.responseJSON;
        if (error.error_code == 100) {
          let msg = error.message.split('&&')[0]
          let field = error.message.split('&&')[1]
          if (field === 'email') {
            $('#ipt-email').val('')
          } else {
            $('#ipt-telegram').val('')
          }
          Swal.fire({
            title: 'Error',
            text: msg,
            icon: 'warning',
            confirmButtonText: 'OK'
          })
          return
        }
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  },

  onSubmitForm: function () {
    const _this = this;
    for (const value of Object.values(this.validationObject)) {
      this.onValidateField(value);
    }

    if (!document.getElementById("frm-signUp").checkValidity()) {
      $("#frm-signUp").addClass("form-validated");
      const heightImage = $('.gw-visual__wrapper').height()
      $('.banner-image').height(heightImage)
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      html: 'Please wait',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    });

    function showUploadError(text) {
      Swal.fire({ title: 'Upload Error', text, icon: 'warning', confirmButtonText: 'OK' })
    }

    let data = {}
    api.postUploadIntro($('#ipt-intro').prop('files')).done(function (res) {
      const introAPI = JSON.parse(res)
      if (introAPI && introAPI.st === true) {
        data.intro_url = introAPI.data[0] || ''

        api.postUploadCv($('#ipt-cv').prop('files')).done(function (res) {
          const cvAPI = JSON.parse(res)
          if (cvAPI && cvAPI.st === true) {
            data.curriculum_vitae_urls = cvAPI.data || []

            if (!$('#ipt-cert').prop('files') || $('#ipt-cert').prop('files').length === 0) {
              Swal.close();
              _this.callSubmitAPI(data);
              return;
            }
            api.postUploadCert($('#ipt-cert').prop('files')).done(function (res) {
              const certAPI = JSON.parse(res)
              if (certAPI && certAPI.st === true) {
                data.certificate_urls = certAPI.data || []

                Swal.close();
                _this.callSubmitAPI(data)
              } else {
                Swal.close();
                showUploadError(`Certificate: ${certAPI.msg}`)
              }
            });
          } else {
            Swal.close();
            showUploadError(`CV: ${cvAPI.msg}`)
          }
        });
      } else {
        Swal.close();
        showUploadError(`Intro audio/video: ${introAPI.msg}`)
      }
    });
  },

  onChangeInputs: function () {
    const _this = this;

    Object.values(_this.validationObject).forEach((value) => {

      if (value && value.id) {
        $(`#${value.id}`).on("change", function () {
          _this.onValidateField(value);
        });
      }
    });
  },

  addEvents: function () {
    var _this = this;
    $('#btn-submit').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.onSubmitForm();
    })

    $('.gw-card__note-title').on('click', function (e) {
      e.preventDefault();
      $(`#note-${$(this).attr('data-label')}`).toggle();
    })

    this.onChangeInputs();
  },
}

$(function () {
  SIGN_UP.init();
  SIGN_UP.addEvents();
});
