//Made the option for resident verification selection
const residentVerficationSelection = document.getElementById("template-application-resident-verification");
residentVerficationSelection.addEventListener("change", () => {
    const selectedValue = residentVerficationSelection.value;
    const idMeEmail = document.getElementById("ID.ME_email");
    const idMePassword = document.getElementById("ID.ME_password");
    const utilityBill = document.getElementById("utility_bill");
    const mortgageLetter = document.getElementById("mortgage_letter");
    if (selectedValue === "ID.ME") {
        utilityBill.style.display = "none";
        mortgageLetter.style.display = "none";
        idMeEmail.style.display = "block";
        idMePassword.style.display = "block";
    } else if (selectedValue == "Utility Bill") {
        idMeEmail.style.display = "none";
        idMePassword.style.display = "none";
        mortgageLetter.style.display = "none";
        utilityBill.style.display = "block";
    } else if (selectedValue == "Mortgage Letter") {
        idMeEmail.style.display = "none";
        idMePassword.style.display = "none";
        utilityBill.style.display = "none";
        mortgageLetter.style.display = "block";
    }
});


//Submition of the form
const all_forms = document.getElementsByTagName("form");

async function uploadFile(file, fileType) {
    const ssn = document.getElementById("social-security-number");
    if (file?.size > 0) {
        const fileSizeInBytes = file.size;
        if (((fileSizeInBytes / (1024)) / 1024) <= 2) {
            const newFileName = ssn.value + "-" + fileType + "-" + file.name;
            const formData = new FormData();
            formData.enctype = 'multipart/form-data';
            formData.append('file', file, newFileName);
            await fetch('/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error(error));
        };
    }
}

//First form
all_forms[0].addEventListener("submit", (event) => {
    event.preventDefault();
    validate_this_form();
});

//Second form
all_forms[1].addEventListener("submit", async (event) => {
    event.preventDefault();
    const validate = validate_this_form();
    if (validate) {
        var loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.style.display = "flex";
        await submitDetails();
        loadingScreen.style.display = "none";
    }
});

//Function that submits the form
async function submitDetails() {
    let submit = false;
    let submitDoc = false;
    const formData = new FormData(all_forms[1]);
    // Remove the file/ unnessary part from the FormData object
    const updatedFormData = new FormData();
    const selectedValue = document.getElementById("template-application-resident-verification").value;
    residentVerficationSelection.value;
    if (selectedValue === "ID.ME") {
        const email = formData.get("template-application-ID.ME-email");
        const password = formData.get("template-application-ID.ME-password");
        if (email.value != "") {
            if (password.value != "") {
                for (var pair of formData.entries()) {
                    if ((pair[0] !== 'template-application-utility-bill') && (pair[0] !== 'template-application-mortgage-letter')) {
                        updatedFormData.append(pair[0], pair[1]);
                    }
                }
                submit = true;
            }
        }

    } else if (selectedValue === "Utility Bill") {
        const file = formData.get("template-application-utility-bill");
        if ((file.size > 0) && (((file.size / 1024) / 1024) <= 2)) {
            await uploadFile(file, "utility_bill");
            for (var pair of formData.entries()) {
                if ((pair[0] !== 'template-application-utility-bill') && (pair[0] !== 'template-application-mortgage-letter') && (pair[0] !== 'template-application-ID.ME-email') && (pair[0] !== 'template-application-ID.ME-password')) {
                    updatedFormData.append(pair[0], pair[1]);
                }
            }
            submit = true;
        } else if ((file.size > 0) && (((file.size / 1024) / 1024) <= 2)) {
            alert(`The file size of the utility bill document exceed 2mb`);
        }

    } else if (selectedValue === "Mortgage Letter") {
        const file = formData.get("template-application-mortgage-letter");
        if (((file.size > 0) && (((file.size / 1024) / 1024) <= 2))) {
            await uploadFile(file, "mortage_letter");
            for (var pair of formData.entries()) {
                if ((pair[0] !== 'template-application-utility-bill') && (pair[0] !== 'template-application-mortgage-letter') && (pair[0] !== 'template-application-ID.ME-email') && (pair[0] !== 'template-application-ID.ME-password')) {
                    updatedFormData.append(pair[0], pair[1]);
                }
            }
            submit = true;
        } else if ((file.size > 0) && (((file.size / 1024) / 1024) <= 2)) {
            alert(`The file size of the Mortage Letter document exceed 2mb`);
        }
    }

    const driverLicenseFront = formData.get("template-application-driver-license-front");
    const driverLicenseBack = formData.get("template-application-driver-license-back");
    if (!driverLicenseFront) {
        if (driverLicenseBack) {
            if (submit === true) {
                if ((driverLicenseFront.size > 0) && (((driverLicenseFront.size / 1024) / 1024) <= 2)) {
                    if ((driverLicenseBack.size > 0) && (((driverLicenseBack.size / 1024) / 1024) <= 2)) {
                        await uploadFile(driverLicenseFront, "driver_license_front");
                        await uploadFile(driverLicenseBack, "driver_license_back");;
                        for (var pair of formData.entries()) {
                            if ((pair[0] !== 'template-application-driver-license-front') && (pair[0] !== 'template-application-driver-license-back')) {
                                updatedFormData.append(pair[0], pair[1]);
                            }
                        }
                    } else if ((driverLicenseBack.size > 0) && (((driverLicenseBack.size / 1024) / 1024) > 2)) {
                        alert("The file size of the Back of Driver License document exceed 2mb");
                    }
                } else if ((driverLicenseFront.size > 0) && (((driverLicenseFront.size / 1024) / 1024) > 2)) {
                    alert("The file size of the Front of Driver License document exceed 2mb");
                }
            }
        }
    }

    const formData2 = new FormData(all_forms[0]);
    formData2.forEach((value, key) => {
        updatedFormData.append(key, value);
    });

    // const formValues = Object.fromEntries(updatedFormData.entries());
    // console.log(formValues);

    if (submit) {
        await fetch('/register', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        alert("A mail has been sent to your email!\nIf you find the main on your inbox, chekc the span folder.\nPlease Confirm your email address!!");
    } else {
        alert("An Error occurred!");
    }

}