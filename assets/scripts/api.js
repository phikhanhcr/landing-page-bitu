class Api {
    constructor() {
        this.url = backend_api_url
        this.uploadUrl = landing_mod_upload_api_url
    }

    callGetApi(url) {
        return $.ajax({
            url: `${this.url}/${url}`,
            type: 'GET',
        })
    }

    callPostApi(url, data, setting = {}) {
        return $.ajax({
            url: `${this.url}/${url}`,
            type: 'POST',
            contentType: 'application/json',
            dataType: setting && setting.dataType ? setting.dataType : 'json',
            processData: false,
            data: JSON.stringify(data)
        })
    }

    callUploadApi(url, data, setting = {}) {
        let formData = new FormData();
        for (let i = 0; i < data.length; i++) {
            formData.append("files[]", data[i]);
        }

        return $.ajax({
            url: `${this.uploadUrl}/${url}`,
            enctype: 'multipart/form-data',
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData
        })
    }

    getCountries() {
        return this.callGetApi('v1.2/configurations/countries');
    }

    postRegisterMod(data) {
        return this.callPostApi('v1.2/moderator-recruitment/signup', data);
    }

    postUploadCv(data) {
        return this.callUploadApi('cv', data);
    }

    postUploadCert(data) {
        return this.callUploadApi('cer', data);
    }

    postUploadIntro(data) {
        return this.callUploadApi('video', data);
    }
}

const api = new Api();