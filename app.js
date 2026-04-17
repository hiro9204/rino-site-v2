document.addEventListener('DOMContentLoaded', () => {
  // --- Constants ---
  const UPPER_IMAGES = [
    "りのトレ　おばけA右.png", "りのトレ　おばけA左.png", "りのトレ　おばけB右.png", "りのトレ　おばけB左.png",
    "りのトレ　おばけC右.png", "りのトレ　おばけC左.png", "りのトレ　つるA右.png", "りのトレ　つるA左.png",
    "りのトレ　つるB右.png", "りのトレ　つるB左.png", "りのトレ　つるC右.png", "りのトレ　つるC左.png",
    "りのトレ　ふりそでぎゅー　右.png", "りのトレ　ふりそでぎゅー　左.png", "りのトレ　小指ぎゅー右.png", "りのトレ　小指ぎゅー左.png",
    "りのトレ　涅槃右A.png", "りのトレ　涅槃右B.png", "りのトレ　涅槃左.png", "りのトレ　涅槃左A.png", "りのトレ　涅槃左B.png",
    "りのトレ　肩ぽわん右.png", "りのトレ　肩ぽわん左.png", "りのトレ　背中きゅん上右.png", "りのトレ　背中きゅん上左.png",
    "りのトレ　背中きゅん下右.png", "りのトレ　背中きゅん下左.png", "りのトレ　脇がち右.png", "りのトレ　脇がち左.png",
    "りのトレ　親指ぎゅー左.png", "りのトレ　親指ギュー右.png"
  ];

  const LOWER_IMAGES = [
    "りのトレ　すりすり右.png", "りのトレ　すりすり左.png", "りのトレ　スネ夫内右.png", "りのトレ　スネ夫外右.png",
    "りのトレ　スネ夫（内左）.png", "りのトレ　スネ夫（外左）.png", "りのトレ　内ももぎゅー右.png", "りのトレ　内ももぎゅー左.png",
    "りのトレ　膝かっくん右.png", "りのトレ　膝かっくん左.png", "りのトレ　足小指ぎゅー右.png", "りのトレ　足小指ぎゅー左.png",
    "りのトレ　足親指ぎゅー右.png", "りのトレ　足親指ぎゅー左.png"
  ];

  const TRAINING_MAP = {
    "涅槃": [11, 12, 133],
    "スネ夫": [148, 214, 222],
    "すりすり": [114],
    "小指": [93, 94, 99, 100, 101, 190],
    "親指": [92, 93, 101, 107, 190, 221],
    "おばけ": [164],
    "つる": [68, 73],
    "ふりそで": [31, 32],
    "肩ぽわん": [39, 40, 216],
    "背中きゅん": [39, 40],
    "脇がち": [31, 32],
    "猫背": [215, 216, 217, 218, 220, 221, 222],
    "上腕二頭筋": [220, 221],
    "腕橈骨筋": [222],
    "反り腰": [114, 203, 205, 207, 209, 210],
    "膝": [148, 214],
    "五十肩": [35, 36, 37, 38, 39]
  };

  const CATEGORIES = {
    all: { label: "すべて", icon: "✨", color: "#2d5a4c" },
    waist: { label: "腰痛・反り腰・丸腰", icon: "🦴", color: "#2d5a4c" },
    shoulder: { label: "肩こり・五十肩・首", icon: "💪", color: "#8b4513" },
    leg: { label: "膝の痛み・足のむくみ", icon: "🦵", color: "#4682b4" },
    hand: { label: "手の痛み・腱鞘炎", icon: "🤲", color: "#556b2f" },
    theory: { label: "身体の仕組み・理論", icon: "🧠", color: "#696969" }
  };

  // --- State ---
  let currentFilter = 'all';
  let searchQuery = '';
  let visibleCount = 12;
  const increment = 12;

  // --- Functions ---

  // 1. Library Rendering
  function renderLibrary() {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;

    const filtered = POSTS.filter(post => {
      const matchCat = currentFilter === 'all' || post.category === currentFilter;
      const matchSearch = post.content.includes(searchQuery) || post.num.toString().includes(searchQuery);
      return matchCat && matchSearch;
    });

    const displayPosts = filtered.slice(0, visibleCount);
    grid.innerHTML = displayPosts.map(post => {
      const cat = CATEGORIES[post.category] || CATEGORIES.all;
      return `
        <div class="post-card reveal" onclick="openModal(${post.num})">
          <div class="card-header">
            <span class="card-cat" style="background:${cat.color}">${cat.icon} ${cat.label}</span>
            <span class="card-num">#${post.num}</span>
          </div>
          <div class="card-excerpt">${post.content}</div>
          <div class="card-footer">
            <span class="card-date">${post.date}</span>
            <span class="card-more">解説を読む →</span>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('resultsCount').innerText = `${filtered.length}件の投稿が見つかりました`;
    document.getElementById('loadMoreWrap').style.display = visibleCount >= filtered.length ? 'none' : 'block';
    
    // Trigger Reveal
    setTimeout(initReveal, 100);
  }

  // 2. Training Gallery Rendering
  function renderGallery(type = 'upper') {
    const gallery = document.getElementById('treGallery');
    if (!gallery) return;

    const images = type === 'upper' ? UPPER_IMAGES : LOWER_IMAGES;
    const path = type === 'upper' ? 'images/upper/' : 'images/lower/';
    
    gallery.innerHTML = images.map(imgName => {
      const displayName = imgName.replace('.png', '').replace('りのトレ　', '');
      return `
        <div class="tre-item reveal" onclick="openImgModal('${path}${imgName}', '${displayName}')">
          <img src="${path}${imgName}" alt="${displayName}" loading="lazy">
          <div class="tre-overlay">
            <span class="tre-name">${displayName}</span>
          </div>
        </div>
      `;
    }).join('');
    setTimeout(initReveal, 100);
  }

  // 3. Modals
  window.openModal = (num) => {
    const post = POSTS.find(p => p.num === num);
    if (!post) return;
    const cat = CATEGORIES[post.category] || CATEGORIES.all;
    const modal = document.getElementById('postModal');
    
    // Search for linked training image
    let linkedImg = null;
    const allImgs = [...UPPER_IMAGES, ...LOWER_IMAGES];
    for (const key in TRAINING_MAP) {
      if (post.content.includes(key) || (post.category === key)) {
        linkedImg = allImgs.find(img => img.includes(key));
        if (linkedImg) break;
      }
    }

    document.getElementById('modalCat').innerText = `${cat.icon} ${cat.label}`;
    document.getElementById('modalCat').style.background = cat.color;
    document.getElementById('modalNum').innerText = `投稿 第${post.num}回`;
    document.getElementById('modalDate').innerText = `投稿日: ${post.date}`;
    
    let bodyHtml = post.content;
    if (linkedImg) {
      const isUpper = UPPER_IMAGES.includes(linkedImg);
      const imgPath = isUpper ? 'images/upper/' : 'images/lower/';
      bodyHtml = `
        <div style="margin-bottom: 2rem; background: #f0f4f2; padding: 1.5rem; border-radius: 16px; border: 1px solid #e0e8e4; text-align: center;">
          <p style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem;">
            📍 この投稿に関連する「りのトレ」
          </p>
          <img src="${imgPath}${linkedImg}" alt="トレーニング画像" style="max-width:100%; max-height: 300px; border-radius:12px; box-shadow: var(--shadow);">
        </div>
        <div style="white-space: pre-wrap;">${post.content}</div>
      `;
    }
    document.getElementById('modalBody').innerHTML = bodyHtml;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.openImgModal = (src, name) => {
    const modal = document.getElementById('imgModal');
    document.getElementById('imgModalSrc').src = src;
    document.getElementById('imgModalName').innerText = name;
    
    // Generate links to relevant posts
    const linkContainer = document.getElementById('imgModalLinkContainer');
    linkContainer.innerHTML = '';
    
    const matchedKey = Object.keys(TRAINING_MAP).find(key => name.includes(key));
    if (matchedKey) {
      const postNums = TRAINING_MAP[matchedKey];
      const linkWrap = document.createElement('div');
      linkWrap.style.display = 'flex';
      linkWrap.style.gap = '10px';
      linkWrap.style.flexWrap = 'wrap';
      linkWrap.style.justifyContent = 'center';

      postNums.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.style.padding = '0.7rem 1.2rem';
        btn.style.fontSize = '0.85rem';
        btn.innerHTML = `📄 第${num}回の解説を読む`;
        btn.onclick = (e) => {
          e.stopPropagation();
          closeImgModal();
          setTimeout(() => openModal(num), 300);
        };
        linkWrap.appendChild(btn);
      });
      linkContainer.appendChild(linkWrap);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    document.getElementById('postModal').classList.remove('active');
    document.body.style.overflow = '';
  }

  function closeImgModal() {
    document.getElementById('imgModal').classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Event Listeners ---

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.cat;
      visibleCount = increment;
      renderLibrary();
    });
  });

  // Search
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClear) searchClear.style.display = searchQuery ? 'block' : 'none';
      visibleCount = increment;
      renderLibrary();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      renderLibrary();
    });
  }

  // Load More
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += increment;
      renderLibrary();
    });
  }

  // Gallery Tabs
  document.querySelectorAll('.tre-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tre-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGallery(tab.dataset.tab);
    });
  });

  // Modal Closers
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.getElementById('imgModalClose')?.addEventListener('click', closeImgModal);
  document.getElementById('imgModalOverlay')?.addEventListener('click', closeImgModal);

  // --- Animations ---
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Navigation Toggle (Mobile)
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // --- Run Initial ---
  renderLibrary();
  renderGallery();
  initReveal();
});
