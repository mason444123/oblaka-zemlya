(() => {
  const root = document.querySelector('[data-hookah-picker]');
  if (!root) return;
  const content = root.querySelector('[data-picker-content]');
  const catalog = {
    leaf: {
      label: 'Табачный лист',
      note: 'Линейки на Virginia, Burley и Oriental — от лёгких до насыщенных.',
      items: [
        ['Virginia', 'Мягкий светлый лист с чистой ароматикой и лёгким характером.'], ['Burley', 'Более плотный лист с выраженной крепостью и табачным телом.'], ['Oriental', 'Пряный ароматный лист с деликатной природной сладостью.'], ['Сарма', 'Российская линейка с яркими вкусами и уверенной насыщенностью.'], ['Darkside', 'Насыщенный современный табак; Core — узнаваемый средний формат.'], ['Sabotage', 'Крепкая линейка Darkside для опытных гостей.'], ['Starline', 'Лёгкая Virginia Gold с яркой и сбалансированной ароматикой.'], ['BlackBurn', 'Сочная ароматная линейка с насыщенным, но управляемым характером.'], ['Overdose', 'Интенсивные вкусы и ощутимая крепость для любителей плотных чаш.'], ['Trofimoff’s', 'Авторская палитра с акцентом на натуральные и сложные вкусы.'], ['Satyr', 'Листовая выразительность и благородные табачные ноты.'], ['Tangiers', 'Культовая крепкая американская смесь с глубоким профилем.'], ['Muassel', 'Классический мягкий стиль с понятной сладкой ароматикой.'], ['Palitra', 'Авторские вкусовые сочетания и выразительные миксы.'], ['Spectrum', 'Широкая палитра для чистых вкусов и аккуратных миксов.'], ['MustHave', 'Плотная современная линейка с яркими узнаваемыми ароматами.'], ['Северный', 'Русский характер: насыщенные вкусы и уверенная подача.'], ['Хулиган', 'Русская линейка с дерзкой ароматикой и плотным профилем.'], ['Sapphire Crown', 'Мягкий фруктовый профиль с аккуратной ароматикой.'], ['Element', 'Разные уровни крепости и чистая миксологическая база.']
      ]
    },
    cigar: {
      label: 'Сигарный лист',
      note: 'Глубокий листовой вкус, натуральные оттенки и спокойная подача.',
      items: [['Bonche', 'Премиальный сигарный лист с выразительным натуральным вкусом.'], ['Dogma', 'Сигарная база с глубокими древесными и ферментированными оттенками.'], ['Deus', 'Насыщенный листовой характер и яркая ароматическая часть.'], ['Kraken', 'Плотный сигарный профиль с долгим послевкусием.'], ['Jent', 'Сигарная линейка с чистым листом и благородной крепостью.']]
    },
    extras: {
      label: 'Кальянная карта',
      note: 'Паровые коктейли, форматы чаш и специальные предложения.',
      sections: [
        { title: 'Специальное предложение', items: [['Дневное предложение', 'С 12:00 до 16:00 — кальян 800 ₽.']] },
        { title: 'Паровые коктейли', items: [['Классический', '1 200 ₽'], ['Premium', '1 500 ₽'], ['Premium X', '2 000 ₽'], ['Авторский «Облака»', '2 500 ₽']] },
        { title: 'Чаши', items: [['Глина', 'Включено в стоимость'], ['Яблоко', '+300 ₽'], ['Цитрус', '+400 ₽'], ['Гранат', '+600 ₽'], ['Ананас', '+1 000 ₽']] },
        { title: 'Формат курения', items: [['Убивашка', 'Интенсивное курение: плотная забивка и максимальная отдача вкуса.'], ['Турка', 'Умеренное курение: ровный прогрев и сбалансированная крепость.'], ['Фанел', 'Мягкое курение: вкус раскрывается плавно, сироп остаётся в чаше.']] }
      ]
    }
  };
  const home = () => {
    const card = (key, group) => `<button class="hookah-category hookah-category--${key}" type="button" data-category="${key}"><strong>${group.label}</strong><em>${group.note}</em><i>Открыть →</i></button>`;
    content.innerHTML = `<section class="hookah-home"><div class="hookah-home__intro"><p>КАЛЬЯНЫ</p><h1>Выберите<br>направление</h1></div><div class="hookah-feature">${card('extras', catalog.extras)}</div><div class="hookah-tobacco-heading"><p>АССОРТИМЕНТ ТАБАКА</p><span>Листовые коллекции для вашего кальяна</span></div><div class="hookah-categories">${card('leaf', catalog.leaf)}${card('cigar', catalog.cigar)}</div></section>`;
  };
  const detail = key => {
    const group = catalog[key];
    const list = group.sections ? group.sections.map(section => `<section class="hookah-menu-section${section.title === 'Специальное предложение' ? ' hookah-menu-section--special' : ''}"><h2>${section.title}</h2><div class="hookah-list">${section.items.map(([name, description]) => `<article class="hookah-item"><h3>${name}</h3><p>${description}</p></article>`).join('')}</div></section>`).join('') : `<div class="hookah-list">${group.items.map(([name, description]) => `<article class="hookah-item"><h2>${name}</h2><p>${description}</p></article>`).join('')}</div>`;
    content.innerHTML = `<section class="hookah-detail hookah-detail--${key}"><button class="hookah-detail__back" type="button" data-back>← Все направления</button><nav class="hookah-filter" aria-label="Категории кальянной карты">${Object.entries(catalog).map(([filterKey, filter]) => `<button type="button" data-category="${filterKey}" class="${filterKey === key ? 'is-active' : ''}">${filter.label}</button>`).join('')}</nav><div class="hookah-detail__intro"><p>КАЛЬЯННАЯ КАРТА</p><h1>${group.label}</h1><span>${group.note}</span></div>${list}</section>`;
  };
  content.addEventListener('click', event => {
    const category = event.target.closest('[data-category]');
    if (category) detail(category.dataset.category);
    if (event.target.closest('[data-back]')) home();
  });
  home();
})();
