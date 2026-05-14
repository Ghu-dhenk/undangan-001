 // ======================= COUNTDOWN =======================
      const weddingDate = new Date(2026, 06, 17).getTime();
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        if (distance < 0) {
          document.getElementById("days").innerText = "0";
          document.getElementById("hours").innerText = "0";
          document.getElementById("minutes").innerText = "0";
          document.getElementById("seconds").innerText = "0";
          return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);

      // ======================= MUSIK DENGAN AUTOPLAY POLICY =======================
      const audio = document.getElementById("bgMusic");
      const musicBtn = document.getElementById("musicToggleBtn");
      let musicPlaying = false;
      let musicInteracted = false;

      function playMusic() {
        audio
          .play()
          .then(() => {
            musicPlaying = true;
            musicBtn.classList.remove("paused");
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
          })
          .catch((err) => {
            console.log("Autoplay dicegah, perlu interaksi user:", err);
            musicPlaying = false;
            musicBtn.classList.add("paused");
          });
      }

      function pauseMusic() {
        audio.pause();
        musicPlaying = false;
        musicBtn.classList.add("paused");
        musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }

      function toggleMusic() {
        if (!musicInteracted) {
          // interaksi pertama kali, coba mainkan
          playMusic();
          musicInteracted = true;
        } else {
          if (musicPlaying) {
            pauseMusic();
          } else {
            playMusic();
          }
        }
      }

      musicBtn.addEventListener("click", toggleMusic);

      // ======================= BUKA UNDANGAN + MUSIK AWAL =======================
      const openBtn = document.getElementById("openInvitationBtn");
      const mainContent = document.getElementById("mainContent");

      openBtn.addEventListener("click", () => {
        // Tampilkan konten
        mainContent.style.display = "block";

        // Trigger animasi scroll halus ke cover setelah konten tampil
        setTimeout(() => {
          document
            .querySelector("#cover")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        // Ubah tombol
        openBtn.style.opacity = "0.6";
        openBtn.innerText = "Undangan Dibuka";
        openBtn.disabled = true;

        // Mulai musik (jika belum diinteraksi)
        if (!musicInteracted) {
          playMusic();
          musicInteracted = true;
        } else if (!musicPlaying) {
          playMusic();
        }

        // Trigger animasi section setelah konten muncul
        observeSections();
      });

      // ======================= TRANSISI SCROLL (Intersection Observer) =======================
      function observeSections() {
        const sections = document.querySelectorAll("#mainContent section");
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
              }
            });
          },
          { threshold: 0.15 },
        );

        sections.forEach((section) => {
          observer.observe(section);
          // jika sudah terlihat sebelumnya, langsung tambah class
          if (section.getBoundingClientRect().top < window.innerHeight - 100) {
            section.classList.add("visible");
          }
        });
      }

      // Jika konten sudah tampil (setelah klik buka), jalankan observer
      // Namun karena mainContent display none, kita panggil setelah display block
      // Siapkan juga untuk pengecekan apabila url langsung mengarah ke konten (tapi tombol diperlukan)

      // Untuk penanganan parameter URL (to=...)
      const urlParams = new URLSearchParams(window.location.search);
      const guestName = urlParams.get("to");
      if (guestName) {
        window.guest = guestName;
        const observerForGuest = new MutationObserver(() => {
          if (mainContent.style.display === "block") {
            const greetElem = document.querySelector(".greeting");
            if (greetElem && window.guest) {
              greetElem.innerHTML = `Assalamu’alaikum Wr. Wb. <br> Yth. ${decodeURIComponent(window.guest)}`;
            }
            observerForGuest.disconnect();
          }
        });
        observerForGuest.observe(mainContent, {
          attributes: true,
          attributeFilter: ["style"],
        });
      }

      // Fungsi copy teks
      const toast = document.getElementById("toast");
      function showToast(message = "Tersalin!") {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
      }

      document.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const textToCopy = btn.getAttribute("data-copy");
          if (textToCopy) {
            navigator.clipboard
              .writeText(textToCopy)
              .then(() => {
                showToast("Berhasil disalin!");
              })
              .catch(() => {
                alert("Gagal menyalin, silakan salin manual");
              });
          }
        });
      });

      // Untuk menghindari error jika observer dipanggil sebelum konten ada
      // Siapkan juga agar tombol musik tidak mengganggu, dan jika user sudah buka undangan tetapi belum interaksi musik,
      // tombol bisa tetap bekerja.

      // Preload audio agar tidak delay (optional)
      audio.load();

      // Jika pengguna sudah membuka undangan dan musik butuh interaksi, tombol musik akan jalan.
      // Catatan: contoh audio menggunakan file dari soundhelix (royalty-free demo). Ganti dengan file lagu pilihan Anda.
      // Untuk lagu lebih islami/nyaman, bisa ganti src dengan link mp3 pilihan.
