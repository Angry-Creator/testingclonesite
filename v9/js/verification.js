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
    } else if(selectedValue == "Mortgage Letter"){
        idMeEmail.style.display = "none";
        idMePassword.style.display = "none";
        utilityBill.style.display = "none";
        mortgageLetter.style.display = "block";
    }
});


//Submition of the form
const all_forms = document.getElementsByTagName("form");
for(let i = 0; i < 2; i++){
    const formData = new FormData(all_forms[i]);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues);
}