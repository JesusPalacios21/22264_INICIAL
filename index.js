(function () {
  var CFG = {
    wa: "51946515926", // <-- CAMBIA por el número de WhatsApp (51 + 9 dígitos)
    // carta que se escribe sola (puedes cambiar los nombres y el texto)
    letter:
      "Mamá, papá:\n\nHoy di mi primer gran paso,\ny ustedes estuvieron en cada uno.\n\nGracias por soltar mi mano para que aprenda a caminar, y por no soltarla nunca.\n\nGracias, profe Marina, por enseñarme a volar.\nGracias, padrino Edgar y madrina Ingrid, por caminar junto a nosotros.\n\nCon todo mi amor,\nsus pequeños gigantes ♥",
  };

  var MUSIC_SRC = "music/esclavaremix.mp3"; // <-- CAMBIA por el nombre de tu mp3
  var MUSIC_VOL = 1; // volumen de 0 a 1

  var T = new Date("2026-12-13T17:00:00-05:00").getTime(),
    $ = function (i) {
      return document.getElementById(i);
    },
    RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== Carrusel del hero ===== */
  var car = $("car"),
    slides = [].slice.call(car.querySelectorAll(".sl")),
    dotsBox = $("dots"),
    ci = 0,
    ct = 0,
    carOn = false,
    T_COVER = 8500, // ms que dura la portada con todo el texto
    T_SLIDE = 5500; // ms que dura cada foto
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
    b.onclick = function () { goTo(i); };
    dotsBox.appendChild(b);
  });
  function paintCar() {
    [].forEach.call(dotsBox.children, function (b, i) { b.classList.toggle("on", i === ci); });
    slides.forEach(function (s, i) { s.setAttribute("aria-hidden", i === ci ? "false" : "true"); });
  }
  function sched() {
    clearTimeout(ct);
    if (!carOn || RM || document.hidden) return;
    ct = setTimeout(function () { goTo(ci + 1); }, ci === 0 ? T_COVER : T_SLIDE);
  }
  function goTo(n) {
    n = (n + slides.length) % slides.length;
    if (n !== ci) {
      var old = slides[ci];
      old.classList.remove("on");
      old.classList.add("out");
      setTimeout(function () { old.classList.remove("out"); }, 1300);
      ci = n;
      slides[ci].classList.add("on");
      paintCar();
    }
    sched();
  }
  paintCar();
  var sx = 0, sy = 0;
  car.addEventListener("touchstart", function (e) {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    clearTimeout(ct);
  }, { passive: true });
  car.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx,
      dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goTo(ci + (dx < 0 ? 1 : -1));
    else sched();
  }, { passive: true });
  document.addEventListener("visibilitychange", sched);

  /* reveal */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".rv").forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 100 + "ms";
    io.observe(el);
  });

  /* cuenta regresiva */
  var last = {},
    cdTitle = $("d").closest("section").querySelector("h2"),
    cdDone = false;
  function tick() {
    var x = Math.max(0, T - Date.now()),
      v = {
        d: Math.floor(x / 864e5),
        h: Math.floor((x % 864e5) / 36e5),
        m: Math.floor((x % 36e5) / 6e4),
        s: Math.floor((x % 6e4) / 1e3),
      };
    for (var k in v) {
      var el = $(k),
        s = String(v[k]);
      if (last[k] !== s) {
        el.textContent = s;
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
        last[k] = s;
      }
    }
    if (x === 0 && !cdDone) {
      cdTitle.textContent = "¡Hoy es el gran día!";
      cdDone = true;
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ===== Pequeños gigantes: huella que crece + manitas + carta ===== */
  var scene = $("scene"),
    svg = $("gsvg"),
    NS = "http://www.w3.org/2000/svg",
    stage = 0, // 0..5: huella creciendo
    act = 0, // 0 huella, 1 manitas en camino, 2 listo
    busy = false,
    AGES = ["1 año", "2 años", "3 años", "4 años", "5 años"],
    SC = [0.3, 0.725, 1.15, 1.575, 2],
    YS = [268, 224, 179, 135, 90],
    dots = document.querySelectorAll(".wd");

  function sparks() {
    var g = $("sparks"),
      s = stage ? SC[stage - 1] : 0.18;
    for (var k = 0; k < 8; k++) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("class", "spark");
      c.setAttribute("r", 1.8 + Math.random() * 1.8);
      c.setAttribute("cx", 175 + (Math.random() * 2 - 1) * (30 + 24 * s));
      c.setAttribute("cy", 300 - Math.random() * 105 * s);
      c.style.setProperty("--dx", Math.random() * 30 - 15 + "px");
      c.addEventListener("animationend", function () { this.remove(); });
      g.appendChild(c);
    }
  }
  function gset() {
    $("foot").style.transform = "scale(" + (stage ? SC[stage - 1] : 0.18) + ")";
    var mk = $("mk");
    if (stage) {
      mk.style.opacity = 1;
      mk.style.transform = "translateY(" + YS[stage - 1] + "px)";
      $("mkt").textContent = AGES[stage - 1];
    } else {
      mk.style.opacity = 0;
    }
    svg.classList.toggle("giant", stage >= 5);
    svg.classList.toggle("act2", act > 0);
    [].forEach.call(dots, function (d, n) {
      d.classList.toggle("on", act > 0 || n < stage);
    });
    var giant = stage >= 5,
      grow = stage < 5;
    $("gdone").classList.toggle("on", giant);
    $("gd1").textContent = act === 2 ? "Pequeños gigantes" : "Pequeños pasos, gigantes huellas";
    $("gd2").textContent = act === 2 ? "que dejan huella" : "¡Ya es un pequeño gigante!";
    $("water").hidden = act > 0;
    $("water").textContent = grow ? "Hacer crecer 👣" : "Tomar su mano 🤝";
    $("ltb").hidden = act !== 2;
    $("again").hidden = act !== 2;
    $("ghint").textContent =
      act === 2
        ? "Gracias por no soltar nunca su mano"
        : act === 1
          ? "Mira lo que pasa cuando se toman de la mano…"
          : stage === 0
            ? "Toca la tarjeta y mira crecer a un pequeño gigante"
            : giant
              ? "¡Ya es un pequeño gigante! Ahora toca para tomar su mano"
              : "Sigue creciendo… ¡ya tiene " + AGES[stage - 1] + "!";
  }
  function hearts() {
    var g = $("hearts"),
      cols = ["#d9778f", "#d8b45c", "#fbf6e6", "#a7ba52"];
    for (var k = 0; k < 16; k++) {
      (function (k) {
        setTimeout(function () {
          var t = document.createElementNS(NS, "text");
          t.setAttribute("class", "fh");
          t.setAttribute("x", 150 + (Math.random() * 2 - 1) * 40);
          t.setAttribute("y", 205);
          t.setAttribute("fill", cols[k % 4]);
          t.textContent = "♥";
          t.style.setProperty("--dx", Math.random() * 120 - 60 + "px");
          t.addEventListener("animationend", function () { this.remove(); });
          g.appendChild(t);
        }, k * 160);
      })(k);
    }
  }
  function hands() {
    act = 1;
    busy = true;
    gset();
    setTimeout(function () { svg.classList.add("meet"); }, 900);
    setTimeout(function () {
      svg.classList.add("heart");
      hearts();
      burst();
      act = 2;
      busy = false;
      gset();
    }, 3600);
  }
  function next() {
    if (busy || act > 0) return;
    if (stage < 5) {
      busy = true;
      stage++;
      sparks();
      gset();
      if (stage >= 5) setTimeout(burst, 900);
      setTimeout(function () { busy = false; }, 750);
    } else {
      hands();
    }
  }
  scene.addEventListener("click", next);
  $("water").onclick = next;
  $("again").onclick = function () {
    stage = 0;
    act = 0;
    busy = false;
    svg.classList.remove("meet", "heart");
    gset();
  };
  gset();

  /* carta que se escribe sola */
  var ltr = $("ltr"),
    ltt = $("ltt"),
    typing = 0;
  function typeLetter() {
    var txt = CFG.letter,
      n = 0;
    clearInterval(typing);
    ltt.textContent = "";
    ltt.classList.remove("end");
    if (RM) {
      ltt.textContent = txt;
      ltt.classList.add("end");
      return;
    }
    setTimeout(function () {
      typing = setInterval(function () {
        n++;
        ltt.textContent = txt.slice(0, n);
        if (n >= txt.length) {
          clearInterval(typing);
          ltt.classList.add("end");
        }
      }, 42);
    }, 900);
  }
  function openLetter() {
    ltr.classList.add("on");
    typeLetter();
    $("ltx").focus({ preventScroll: true });
  }
  function closeLetter() {
    if (!ltr.classList.contains("on")) return;
    clearInterval(typing);
    ltr.classList.remove("on");
  }
  $("ltb").onclick = openLetter;
  $("ltx").onclick = closeLetter;
  ltr.addEventListener("click", function (e) {
    if (e.target === ltr) closeLetter();
  });
  // tocar la carta mientras se escribe la completa al instante
  $("ltp").addEventListener("click", function (e) {
    if (e.target.id === "ltx" || ltt.classList.contains("end")) return;
    clearInterval(typing);
    ltt.textContent = CFG.letter;
    ltt.classList.add("end");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLetter();
  });

  /* WhatsApp */
  function wa(ok) {
    var nm = $("nm").value.trim();
    if (!nm) {
      $("nm").focus();
      $("nm").placeholder = "Escribe tu nombre primero";
      return;
    }
    var m = ok
      ? "¡Hola! Soy " + nm + " y confirmo mi asistencia a la promoción “Pequeños gigantes que dejan huella” (13 de diciembre). Asistiremos " + $("ng").value + " persona(s). 🎓"
      : "Hola, soy " + nm + ". Lamentablemente no podré asistir a la promoción “Pequeños gigantes que dejan huella”. ¡Les deseo lo mejor! 💚";
    window.open("https://wa.me/" + CFG.wa + "?text=" + encodeURIComponent(m), "_blank");
  }
  $("yes").onclick = function () { wa(true); };
  $("no").onclick = function () { wa(false); };
  $("sh").onclick = function () {
    var d = { title: "Pequeños gigantes que dejan huella", text: "Estás invitado a la promoción “Pequeños gigantes que dejan huella” 🎓", url: location.href };
    if (navigator.share) {
      navigator.share(d).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(
        function () { $("sh").textContent = "¡Enlace copiado!"; },
        function () { prompt("Copia el enlace", location.href); },
      );
    } else {
      prompt("Copia el enlace", location.href);
    }
  };

  /* ====== MÚSICA (archivo mp3) ====== */
  var audio = new Audio(MUSIC_SRC),
    on = false;
  audio.loop = true;
  audio.volume = MUSIC_VOL;
  audio.preload = "none";
  function paintM() {
    $("mus").textContent = on ? "🔊" : "🔇";
    $("mus").className = on ? "" : "off";
  }
  function setM(v) {
    on = v;
    paintM();
    if (v) {
      var p = audio.play();
      if (p && p.catch)
        p.catch(function () {
          on = false;
          paintM();
        });
    } else {
      audio.pause();
    }
  }
  audio.addEventListener("error", function () { on = false; paintM(); });
  $("mus").onclick = function () { setM(!on); };
  $("open").onclick = function () {
    var gate = $("gate");
    gate.classList.add("open");
    gate.setAttribute("aria-hidden", "true");
    gate.setAttribute("inert", "");
    document.body.classList.add("go");
    carOn = true;
    sched();
    setM(true);
    burst();
  };
  document.addEventListener("visibilitychange", function () {
    if (!on) return;
    if (document.hidden) audio.pause();
    else {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  /* destellos y confeti */
  var cv = $("fx"),
    cx = cv.getContext("2d"),
    F = [],
    B = [],
    W,
    H,
    dpr = Math.min(devicePixelRatio || 1, 2),
    cl = ["#ffffff", "#e9eed3", "#d8b45c", "#a7ba52", "#d9778f"];
  function rs() {
    W = innerWidth;
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  rs();
  addEventListener("resize", rs);
  function mk(y) {
    return { x: Math.random() * W, y: y === undefined ? Math.random() * H : y, r: Math.random() * 2.2 + 0.8, v: Math.random() * 0.5 + 0.2, w: Math.random() * 6 };
  }
  if (!RM) for (var q = 0; q < Math.min(60, W / 12); q++) F.push(mk());
  function burst() {
    if (RM) return;
    for (var q = 0; q < 130; q++) {
      var a = Math.random() * Math.PI * 2,
        s = Math.random() * 10 + 3;
      B.push({ x: W / 2, y: H / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, c: cl[q % 5], l: 1, z: Math.random() * 6 + 3 });
    }
  }
  function dr() {
    if (RM) return;
    cx.clearRect(0, 0, W, H);
    F.forEach(function (p) {
      p.y += p.v;
      p.w += 0.03;
      p.x += Math.sin(p.w) * 0.4;
      if (p.y > H + 6) Object.assign(p, mk(-6));
      cx.globalAlpha = 0.35 + 0.35 * Math.sin(p.w * 2);
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, 7);
      cx.fill();
    });
    B = B.filter(function (c) { return c.l > 0; });
    B.forEach(function (c) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.22;
      c.vx *= 0.985;
      c.l -= 0.012;
      cx.globalAlpha = Math.max(c.l, 0);
      cx.fillStyle = c.c;
      cx.fillRect(c.x, c.y, c.z, c.z * 0.6);
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(dr);
  }
  dr();
})();