
 // search box 


const searchInput = document.querySelector(".search-box input"); //  document hewa script dyal js bach t7ededlo wa7ed element or tagu f html
const resultsBox = document.querySelector(".results-box");

if(searchInput) {                 // search input hya value li yjib mn html tag search box
    const medecinsArray = [ 
        "Dr. Ahmed Amrani - Cardiologue",
        "Dr. Samira Hajjaj - Dermatologue",
        "Dr. Mohammed Benali - Dentiste",
        "Dr. Fatima El Idrissi - Pédiatre"
    ];

    searchInput.addEventListener("input", () => { // in fois tapper user chi mots gha apliqua dak coode dak input b7al wa7ed raadar fach ytbe9 dak code li dkhlt ytle3
        const valeur = searchInput.value.toLowerCase().trim(); // dak var ymchi stocker valeur li kyn f input w gha y7welha minuscul tolwer w y7yd espc f trim
        resultsBox.innerHTML = ""; // ay haja fdiv khwiha 

        if (valeur === "") {
            resultsBox.style.display = "none";
            return;
        }

        const resultats = medecinsArray.filter(m => m.toLowerCase().includes(valeur));
        resultsBox.style.display = "block"; // afficher dakchi li l9a

        if(resultats.length > 0){
            resultats.forEach(med => {
                const item = document.createElement("div");
                item.classList.add("result-item");
                item.textContent = med;
                item.addEventListener("click", () => {
                    
                    window.location.href = "medecins.html?search=" + encodeURIComponent(med.split(' - ')[0]);    // Redirection vers la page medecins
                });
                resultsBox.appendChild(item);
            });
        } else {
            const noresult = document.createElement("div");
            noresult.classList.add("no-result");
            noresult.textContent = "Aucun médecin trouvé";
            resultsBox.appendChild(noresult);
        }
    });
}



// Filtrage sur page Medecins


const doctorCards = document.querySelectorAll(".doctor-card");
if(doctorCards.length > 0){
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if(searchQuery){
        searchInput.value = searchQuery;
        filterDoctors(searchQuery);
    }

    if(searchInput){
        searchInput.addEventListener("input", () => {
            filterDoctors(searchInput.value.trim().toLowerCase());
        });
    }

    function filterDoctors(query){
        doctorCards.forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const specialty = card.querySelector(".specialty").textContent.toLowerCase();
            if(name.includes(query) || specialty.includes(query)){
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }
}




















////// page carousel //////

// Carousel Conseils


const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide,i) => {
        slide.classList.remove("active");
        dots[i].classList.remove("active");
    });
    slides[index].classList.add("active");
    dots[index].classList.add("active");
}

if(slides.length > 0){
    document.querySelector(".next").addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    document.querySelector(".prev").addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    dots.forEach((dot,index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            showSlide(index);
        });
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4000);
}


















////////// local storage ////////////////

// Formulaire Rendez-vous + LocalStorage


const form = document.getElementById("rdv-form");
const rendezSection = document.querySelector(".rendez-vous-section");

if(form){
    // preremplir medecin si passe par bouton
    const urlParams = new URLSearchParams(window.location.search);
    const doctorPrefill = urlParams.get('doctor');
    if(doctorPrefill){
        const selectMed = form.querySelector("select");
        selectMed.value = doctorPrefill;
    }

    // charger rendezvous existants
    let rdvArray = JSON.parse(localStorage.getItem("rendezvous")) || [];
    displayRdv();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nom = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="text"]:nth-of-type(2)').value.trim();
        const tel = form.querySelector('input[type="text"]:nth-of-type(3)').value.trim();
        const med = form.querySelector('select').value;
        const date = form.querySelector('input[type="date"]').value;
        const heure = form.querySelector('input[type="time"]').value;
        const motif = form.querySelector('textarea').value.trim();

        if(!nom || !email || !tel || !med || !date || !heure || !motif){
            alert("Veuillez remplir tous les champs!");
            return;
        }

        // ajouter tableau
        const rdv = {nom,email,tel,med,date,heure,motif};
        rdvArray.push(rdv);
        localStorage.setItem("rendezvous", JSON.stringify(rdvArray));

        form.reset();
        displayRdv();
    });

    function displayRdv(){
        const container = rendezSection.querySelector("div.aucun");
        container.innerHTML = "";
        if(rdvArray.length === 0){
            container.innerHTML = "<p>Aucun rendez-vous pour le moment</p>";
            return;
        }

        rdvArray.forEach(rdv => {
            const div = document.createElement("div");
            div.classList.add("rdv-card");
            div.innerHTML = `
                <p><strong>Médecin:</strong> ${rdv.med}</p>
                <p><strong>Nom:</strong> ${rdv.nom}</p>
                <p><strong>Email:</strong> ${rdv.email}</p>
                <p><strong>Téléphone:</strong> ${rdv.tel}</p>
                <p><strong>Date:</strong> ${rdv.date} à ${rdv.heure}</p>
                <p><strong>Motif:</strong> ${rdv.motif}</p>
                <hr>
            `;
            container.appendChild(div);
        });
    }
}


// Lien dyal prendre rendez-vous sur page medecin


const rdvButtons = document.querySelectorAll(".rendez-vous");
rdvButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const docName = e.target.closest(".doctor-card").querySelector("h3").textContent;
        window.location.href = `rendezvous.html?doctor=${encodeURIComponent(docName)}`;
    });
});
























// local storage

const rdvForm = document.getElementById('rdv-form');
const rendezVousSection = document.querySelector('.rendez-vous-section .aucun');

if (rdvForm && rendezVousSection) {

  
  //local storage kathez fih rendez vous
  
  function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    rendezVousSection.innerHTML = ''; // n7eydo l9dim

    if (appointments.length === 0) {
      rendezVousSection.innerHTML = '<p>Aucun rendez vous pour le moment</p>';
      return;
    }

    appointments.forEach((appointment, index) => {
      const div = document.createElement('div');
      div.classList.add('rdv-card');
      div.innerHTML = `
        <strong>${appointment.name}</strong> (${appointment.email})<br>
        📞 ${appointment.phone}<br>
        🩺 ${appointment.doctor}<br>
        📅 ${appointment.date} à ${appointment.time}<br>
        💬 ${appointment.reason}<br>
        <button class="delete-btn" data-index="${index}">❌ Supprimer</button>
      `;
      rendezVousSection.appendChild(div);
    });

    // boton bach delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        deleteAppointment(index);
      });
    });
  }

  
  //  save rendez vous f localStorage
 
  function saveAppointment(appointment) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }

 
  // delete rendez vous 
  
  function deleteAppointment(index) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.splice(index, 1);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointments();
  }


  // checker donner wach vrai 
 
  function validateForm(name, email, phone, doctor, date, time) {
    if (!name.trim()) return alert('Veuillez entrer votre nom complet');
    if (!email.includes('@')) return alert('Veuillez entrer un email valide');
    if (!phone.trim()) return alert('Veuillez entrer votre numéro de téléphone');
    if (doctor === 'Choisir un médecin') return alert('Veuillez choisir un médecin');
    if (!date) return alert('Veuillez choisir une date');
    if (!time) return alert('Veuillez choisir une heure');
    return true;
  }


  //  bach sender forms

  rdvForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = rdvForm.querySelector('input[placeholder="Nom et Prénom"]').value;
    const email = rdvForm.querySelector('input[placeholder="votre.email@exemple.com"]').value;
    const phone = rdvForm.querySelector('input[placeholder="06 12 34 56 78"]').value;
    const doctor = rdvForm.querySelector('select').value;
    const date = rdvForm.querySelector('input[type="date"]').value;
    const time = rdvForm.querySelector('input[type="time"]').value;
    const reason = rdvForm.querySelector('textarea').value;

    if (!validateForm(name, email, phone, doctor, date, time)) {
      return;
    }

    const appointment = { name, email, phone, doctor, date, time, reason };

    saveAppointment(appointment);
    loadAppointments();
    rdvForm.reset();

    alert('✅ Rendez-vous confirmé avec succès !');
  });


  // thez rendez vous fach tfte7 page     

  loadAppointments();
}





























