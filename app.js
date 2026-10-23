import {productImageSources,fallbackProductImage} from './shared/product-images.js';
import {mountNavigationMotion} from './shared/motion.js';
import {mountChats} from './shared/chats.js';
import {routePreviewMarkup,mountRoutePreview} from './shared/route-preview.js';
import { translateUi } from "./shared/ui-copy.js";
import {mountTelegramLink} from './shared/account-link.js';
import {productSpecifications,productOfferPricing,productAvailability} from './shared/products.js';
import {mountStoreMap} from './shared/maps.js';
import './shared/appearance.js';
import {ensureLegalAcceptance,placementLabel,rankingHelp,paymentStateView} from './shared/compliance.js';
import {mediaUrl,installPrivateMediaImages,withoutMediaCapabilities,clearPrivateMediaImages} from './shared/api.js';
import {createBuyerAuth} from './buyer-auth.js?v=20261003-1';
function resolveApiBaseUrl(configuredUrl, location) {
  const raw=String(configuredUrl||'').trim().replace(/\/+$/,'');
  if(!raw && !['localhost','127.0.0.1','[::1]','::1'].includes(location?.hostname))return '';
  try {
    const url=new URL(raw || location.origin);
    if(url.username || url.password || url.search || url.hash)return '';
    const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
    if(url.protocol!=='https:' && !(local && url.protocol==='http:'))return '';
    return url.href.replace(/\/+$/,'');
  } catch { return ''; }
}
const API_BASE = resolveApiBaseUrl(window.IZBOR_CONFIG?.PUBLIC_API_BASE_URL || window.MAPMARKET_CONFIG?.PUBLIC_API_BASE_URL,window.location);
const API_REQUEST_TIMEOUT_MS = 15_000;

const dictionary = {
  ru: {availability:"Наличие",inStock:"В наличии",outOfStock:"Нет в наличии",unconfirmed:"Наличие не подтверждено",specifications:"Характеристики",description:"Описание",noDescription:"Описание пока не добавлено.",backToProducts:"Назад к товарам",imageLabel:"Фото товара", howSearch:'Найдите товар',howSearchText:'Введите название или выберите категорию, чтобы сравнить предложения магазинов.',howCompare:'Выберите магазин',howCompareText:'Проверьте цену, наличие и описание перед визитом.',howRoute:'Постройте маршрут',howRouteText:'Откройте магазин на карте и выберите удобный способ добраться.',sellerLink:'Izbor Seller — для продавцов',brandPromise:'Избор — товары, магазины и маршруты рядом.', home:'Главная', favorites:'Избранное', catalog:'Каталог', chats:'Чаты', profile:'Профиль', map:'Карта', language:'Язык', searchPlaceholder:'Поиск товаров и категорий', hello:'Добро пожаловать', hero:'Находите лучшие товары рядом', heroText:'Сравнивайте цены, открывайте магазины на карте и прокладывайте маршрут.', explore:'Смотреть каталог', openMap:'Открыть карту', recommendations:'Рекомендации', nearby:'Магазины рядом', all:'Все', login:'Войти', logout:'Выйти', notifications:'Уведомления', wallet:'Кошелёк и покупки', settings:'Настройки', help:'Справка и поддержка', account:'Мой аккаунт', empty:'Здесь пока ничего нет', price:'Цена', route:'Проложить маршрут', write:'Написать продавцу', reviews:'Отзывы', send:'Отправить', addPhoto:'Добавить фото', message:'Введите сообщение', save:'Сохранить', deleteAccount:'Удалить аккаунт', searchResults:'Результаты поиска', categories:'Категории', recently:'Недавно просмотренные', loadMore:'Показать ещё', retry:'Повторить' },
  en: {availability:"Availability",inStock:"In stock",outOfStock:"Out of stock",unconfirmed:"Availability unconfirmed",specifications:"Specifications",description:"Description",noDescription:"No description yet.",backToProducts:"Back to products",imageLabel:"Product image", howSearch:'Find a product',howSearchText:'Search by name or category to compare store offers.',howCompare:'Choose a store',howCompareText:'Check the price, availability and description before visiting.',howRoute:'Get directions',howRouteText:'Open the store on the map and choose how to get there.',sellerLink:'For sellers',brandPromise:'Products, stores and directions nearby.', home:'Home', favorites:'Favorites', catalog:'Catalog', chats:'Chats', profile:'Profile', map:'Map', language:'Language', searchPlaceholder:'Search products and categories', hello:'Welcome', hero:'Find the best products nearby', heroText:'Compare prices, discover stores on the map and build a route.', explore:'Browse catalog', openMap:'Open map', recommendations:'Recommendations', nearby:'Nearby stores', all:'All', login:'Sign in', logout:'Sign out', notifications:'Notifications', wallet:'Wallet and purchases', settings:'Settings', help:'Help and support', account:'My account', empty:'Nothing here yet', price:'Price', route:'Build route', write:'Message seller', reviews:'Reviews', send:'Send', addPhoto:'Add photo', message:'Enter a message', save:'Save', deleteAccount:'Delete account', searchResults:'Search results', categories:'Categories', recently:'Recently viewed', loadMore:'Load more', retry:'Retry' },
  uz: {availability:"Mavjudlik",inStock:"Mavjud",outOfStock:"Mavjud emas",unconfirmed:"Mavjudligi tasdiqlanmagan",specifications:"Xususiyatlar",description:"Tavsif",noDescription:"Tavsif hali qo‘shilmagan.",backToProducts:"Mahsulotlarga qaytish",imageLabel:"Mahsulot rasmi", howSearch:'Mahsulotni toping',howSearchText:'Do‘kon takliflarini solishtirish uchun nom yoki toifa bo‘yicha qidiring.',howCompare:'Do‘konni tanlang',howCompareText:'Borishdan oldin narx, mavjudlik va tavsifni tekshiring.',howRoute:'Yo‘nalish tuzing',howRouteText:'Do‘konni xaritada oching va borish usulini tanlang.',sellerLink:'Sotuvchilar uchun',brandPromise:'Yaqindagi mahsulotlar, do‘konlar va yo‘nalishlar.', home:'Bosh sahifa', favorites:'Sevimlilar', catalog:'Katalog', chats:'Chatlar', profile:'Profil', map:'Xarita', language:'Til', searchPlaceholder:'Mahsulot va toifalarni qidirish', hello:'Xush kelibsiz', hero:'Yaqindagi eng yaxshi mahsulotlarni toping', heroText:'Narxlarni solishtiring, xaritada do‘konlarni toping va yo‘nalish tuzing.', explore:'Katalogni ko‘rish', openMap:'Xaritani ochish', recommendations:'Tavsiyalar', nearby:'Yaqindagi do‘konlar', all:'Barchasi', login:'Kirish', logout:'Chiqish', notifications:'Bildirishnomalar', wallet:'Hamyon va xaridlar', settings:'Sozlamalar', help:'Yordam', account:'Mening hisobim', empty:'Hozircha bu yer bo‘sh', price:'Narx', route:'Yo‘nalish', write:'Sotuvchiga yozish', reviews:'Sharhlar', send:'Yuborish', addPhoto:'Rasm qo‘shish', message:'Xabar kiriting', save:'Saqlash', deleteAccount:'Hisobni o‘chirish', searchResults:'Qidiruv natijalari', categories:'Toifalar', recently:'Yaqinda ko‘rilgan', loadMore:'Yana ko‘rsatish', retry:'Qayta urinish' },
};

function storedJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}
for(const [language,copy] of Object.entries({ru:{allProducts:'Все товары',openStore:'Открыть магазин',guest:'Гость',reviewCount:'отзывов'},en:{allProducts:'All products',openStore:'Open store',guest:'Guest',reviewCount:'reviews'},uz:{allProducts:'Barcha mahsulotlar',openStore:'Do‘konni ochish',guest:'Mehmon',reviewCount:'sharh'}}))Object.assign(dictionary[language],copy);
const state = {
  webSession: false,
  route: 'home', token: localStorage.getItem('mm_web_token') || '',
  refreshToken: localStorage.getItem('izbor_web_refresh') || '',
  user: storedJson('mm_web_user', null),
  language: localStorage.getItem('mm_web_language') || 'ru',
  products: [], shops: [], categories: [], favorites: new Set(), recent: storedJson('mm_web_recent', []),
  productCache: new Map(), productDetailRequests: new Map(),
  catalogLoaded: false, shopsLoaded: false, categoriesLoaded: false,
  catalogQuery: {}, catalogOffset: 0, catalogHasMore: false, catalogLoading: false, catalogRequestId: 0,
  chats: [], activeChat: null, pendingFile: null, map: null, markers: [], loading: false,
  activeProduct: null, productImageIndex: 0,
  searchSuggestionId: 0,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const uiText = value => translateUi(value,state.language);
const t = (key) => dictionary[state.language]?.[key] || dictionary.ru[key] || key;
const esc = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const money = (value) => `${new Intl.NumberFormat(state.language === 'en' ? 'en-US' : 'ru-RU').format(Number(value || 0))} ${state.language==='en'?'UZS':state.language==='uz'?'so‘m':'сум'}`;
// Display translated category labels while retaining canonical server values in filters.
const categoryNames={'Продукты и супермаркеты':['Groceries','Oziq-ovqat va supermarketlar'],'Электроника и техника':['Electronics','Elektronika va texnika'],'Здоровье и аптеки':['Health and pharmacies','Salomatlik va dorixonalar'],'Одежда и обувь':['Clothing and shoes','Kiyim va poyabzal'],'Красота и уход':['Beauty and care','Go‘zallik va parvarish'],'Дом и ремонт':['Home and renovation','Uy va ta’mirlash'],'Еда и общепит':['Food and dining','Ovqat va umumiy ovqatlanish']};
const categoryTitle=value=>categoryNames[value]?.[state.language==='en'?0:state.language==='uz'?1:-1]||value;
const imageUrl = (raw) => mediaUrl(raw,API_BASE) || 'assets/product-placeholder.svg';
const authHeaders = () => state.token ? {Authorization:`Bearer ${state.token}`} : {};

installPrivateMediaImages({request: api, baseUrl: API_BASE, onUnavailable: fallbackProductImage});
let refreshInFlight=null,buyerSessionEpoch=0;
async function api(path, options={}) {
  const requestEpoch=buyerSessionEpoch;
  if(!API_BASE)throw new Error('Адрес сервера не настроен. Обновите страницу или обратитесь в поддержку.');
  const {auth=true, _refreshed, ...requestOptions}=options;
  const headers = {...(path.startsWith('/auth/')?{'X-Web-Client':'buyer'}:{}), ...(auth?authHeaders():{}), ...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...(options.headers||{})};
  const controller=new AbortController();
  const externalSignal=requestOptions.signal;
  const abortExternal=()=>controller.abort();
  if(externalSignal?.aborted)controller.abort();else externalSignal?.addEventListener('abort',abortExternal,{once:true});
  const timeout=setTimeout(()=>controller.abort(),API_REQUEST_TIMEOUT_MS);
  let response, data;
  try {
    response = await fetch(`${API_BASE}${path}`, {...requestOptions, headers, signal:controller.signal, credentials:'include'});
    data = await response.json().catch(error => {
      if (controller.signal.aborted) throw error;
      return {};
    });
  } catch (error) {
    if(controller.signal.aborted)throw new Error('Сервер отвечает слишком долго. Проверьте интернет и повторите попытку.');
    throw new Error('Не удалось подключиться к серверу Izbor Market. Проверьте интернет и откройте сайт по официальной ссылке.');
  } finally {
    clearTimeout(timeout);externalSignal?.removeEventListener('abort',abortExternal);
  }
  if(response.status===401&&auth&&requestEpoch!==buyerSessionEpoch)throw new Error('Аккаунт изменился. Повторите действие.');
  if(response.status===401&&auth&&state.token&&!options._refreshed){
    await refreshBuyerSession();return api(path,{...options,_refreshed:true});
  }
  if (!response.ok) { const error=new Error(data.error || `Ошибка ${response.status}`);error.status=response.status;throw error; }
  return data;
}

async function refreshBuyerSession() {
  if(!refreshInFlight){
    const epoch=buyerSessionEpoch;
    refreshInFlight=api('/auth/web/session',{method:'POST',auth:false,body:JSON.stringify(state.refreshToken?{refresh_token:state.refreshToken}:{})})
      .then(value=>{
        if(epoch!==buyerSessionEpoch)throw new Error('Сессия завершена.');
        if(value.web_session!==true)throw new Error('Сначала обновите backend для сохранения входа.');
        state.token=value.access_token||value.token;state.refreshToken='';state.webSession=true;persistSession();
      }).catch(error=>{if(epoch===buyerSessionEpoch&&error.status===401)clearBuyerSession();throw error;})
      .finally(()=>refreshInFlight=null);
  }
  return refreshInFlight;
}
function icon(name, size=20) { return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`; }
function refreshIcons() { window.lucide?.createIcons({attrs:{'stroke-width':2.1}}); }
function toast(message, error=false) { const el=document.createElement('div'); el.className=`toast${error?' error':''}`; el.textContent=message; $('#toastRoot').append(el); setTimeout(()=>el.remove(),3200); }
function setLoading() { $('#view').innerHTML='<div class="loader"><div class="spinner"></div></div>'; }
function requireAuth(action) { if(state.token) return true; showAuth(action); return false; }

const navItems = [
  ['home','house','home'], ['favorites','heart','favorites'], ['map','map','map'], ['chats','message-circle','chats'], ['profile','user-round','profile'],
];

function renderNavigation() {
  document.documentElement.lang=state.language;
  const html = navItems.map(([route,ico,label])=>`<button class="nav-button ${(state.route===route || (route==='home'&&['catalog','search','product','store'].includes(state.route)))?'active':''}" data-route="${route}">${icon(ico)}<span>${t(label)}</span></button>`).join('');
  for (const [id,compact] of [['#desktopNav',false],['#mobileNav',true]]) {
    const nav = $(id);
    if (!nav.querySelector('[data-route]')) nav.innerHTML = html;
    for (const [route,ico,label] of navItems) {
      const button = nav.querySelector(`[data-route="${route}"]`);
      button.classList.toggle('active',state.route===route || (route==='home'&&['catalog','search','product','store'].includes(state.route)));
      button.innerHTML = `${icon(ico)}<span>${t(label)}</span>`;
    }
    mountNavigationMotion(nav,{compact});
  }
  $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $$('.catalog-shortcut').forEach(el=>el.setAttribute('aria-label',t('catalog')));
  $$('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  $('#sideName').textContent = state.user?.name || t('guest');
  $('#sideAvatar').textContent = (state.user?.name || 'M').trim()[0]?.toUpperCase() || 'M';
  $('#clearSearch').setAttribute('aria-label',uiText('Очистить'));
  refreshIcons();
}

function routeHash(route,data){return '#/'+route+(data===null||data===''?'':'/'+encodeURIComponent(String(data)));}
function readRouteHash(){
  const match=location.hash.match(/^#\/(home|catalog|favorites|map|profile|notifications|search|product|store|chats)(?:\/(.*))?$/);
  if(!match)return null;
  let data=null;try{data=match[2]===undefined?null:decodeURIComponent(match[2]);}catch{return null;}
  if(['product','store'].includes(match[1])&&!/^[1-9][0-9]{0,9}$/.test(data||''))return null;
  return {route:match[1],data};
}
let chatCleanup=()=>{};
async function navigate(route, data=null, {fromHistory=false}={}) {
  chatCleanup();chatCleanup=()=>{};
  if(!fromHistory && location.hash!==routeHash(route,data))history.pushState(null,'',routeHash(route,data));
  if(state.route==='map'&&route!=='map'){state.map?.remove();state.map=null;}
  state.searchSuggestionId++; $('#searchSuggestions').classList.add('hidden');
  state.route=route; state.routeData=data; renderNavigation(); window.scrollTo({top:0,behavior:'smooth'}); setLoading();
  try {
    if(state.token&&!await ensureLegalAcceptance((path,options={})=>api(path,{...options,...(options.body!==undefined?{body:JSON.stringify(options.body)}:{})}))){$('#view').innerHTML=`<section class="card"><h2>${esc(uiText("Необходимо принять новые версии документов"))}</h2><button class="button" data-retry-route>${esc(uiText("Открыть документы"))}</button></section>`;return;}
    if(route==='ranking'){$('#view').innerHTML=rankingHelp();return;}
    if(route==='home') await renderHome();
    else if(route==='catalog') await renderCatalog(data);
    else if(route==='favorites') await renderFavorites();
    else if(route==='map') await renderMap();
    else if(route==='chats') await renderChats(Number(data)||undefined);
    else if(route==='profile') await renderProfile();
    else if(route==='notifications') await renderNotifications();
    else if(route==='search') await renderSearch(data || '');
    else if(route==='product') await renderProductDetails(Number(data));
    else if(route==='store') await renderStorePage(Number(data));
  } catch(error) { $('#view').innerHTML=errorState(error); }
  refreshIcons();
}

async function bootstrap() {
  const initialRoute=readRouteHash();
  renderNavigation(); bindGlobalEvents();
  // Paint the public home immediately; network and session validation continue below.
  renderHome(true);
  try {
    await refreshBuyerSession();
    const me=await api('/users/me');state.user=me.user;persistSession();renderNavigation();
    await loadFavorites().catch(error=>toast(error.message,true));
  } catch(error) { if(error.status===401)clearBuyerSession();else toast(error.message,true); }
  const initialLoads=await Promise.allSettled([loadProducts(), loadShops(), loadCategories()]);
  const initialFailure=initialLoads.find(result=>result.status==='rejected');
  if(state.route==='home'){
    if(initialFailure){$('#view').innerHTML=errorState(initialFailure.reason);}
    else if(!state.token){await renderHome();refreshIcons();}
    else await navigate('home',null,{fromHistory:true});
  }
  if(initialRoute)await navigate(initialRoute.route,initialRoute.data,{fromHistory:true});
  const incomingShop=new URLSearchParams(location.search).getAll('shop');
  if(incomingShop.length===1&&/^[1-9][0-9]{0,9}$/.test(incomingShop[0])&&Number(incomingShop[0])<=2147483647){
    const id=Number(incomingShop[0]);
    if(state.token){try{await api(`/shops/${id}/subscription`,{method:'POST'});}catch(error){toast(error.message,true);}}
    const url=new URL(location.href);url.searchParams.delete('shop');url.searchParams.delete('source');history.replaceState(null,'',url);
    await showStore(id);
  }
  if(state.token) { checkNotifications(); }

}

const CATALOG_PAGE_SIZE = 24;
const PRODUCT_DETAIL_CACHE_TTL_MS = 60_000;
const PRODUCT_CACHE_MAX_ENTRIES = 250;
function productCacheKey(id, language=state.language) { return `${language}:${Number(id)}`; }
function cacheProduct(product, {language=state.language, detailed=false}={}) {
  const id=Number(product?.id);
  if(!Number.isInteger(id)||id<=0)return null;
  const key=productCacheKey(id,language), previous=state.productCache.get(key);
  const entry={product:{...(previous?.product||{}),...product},detailed:detailed||Boolean(previous?.detailed),fetchedAt:detailed?Date.now():(previous?.fetchedAt||0)};
  state.productCache.delete(key);
  state.productCache.set(key,entry);
  while(state.productCache.size>PRODUCT_CACHE_MAX_ENTRIES)state.productCache.delete(state.productCache.keys().next().value);
  return entry;
}
function getCachedProduct(id, language=state.language) {
  return state.productCache.get(productCacheKey(id,language)) || null;
}
async function fetchProductDetails(id, language=state.language) {
  const key=productCacheKey(id,language), existing=state.productDetailRequests.get(key);
  if(existing)return existing;
  const request=api(`/products/${Number(id)}?lang=${encodeURIComponent(language)}`)
    .then(product=>cacheProduct(product,{language,detailed:true}).product)
    .finally(()=>state.productDetailRequests.delete(key));
  state.productDetailRequests.set(key,request);
  return request;
}
async function loadProducts(params={}, {append=false}={}) {
  if (append && state.catalogLoading) return state.products;
  if (append && !state.catalogHasMore) return state.products;
  if (!append) {
    state.catalogQuery = {...params};
    state.catalogOffset = 0;
    state.catalogHasMore = true;
    state.products = [];
  }
  const requestId=++state.catalogRequestId;
  state.catalogLoading = true;
  try {
    const qs = new URLSearchParams({lang:state.language,limit:String(CATALOG_PAGE_SIZE),offset:String(state.catalogOffset),...state.catalogQuery});
    const page = await api(`/products?${qs}`);
    if (requestId!==state.catalogRequestId) return state.products;
    const products = Array.isArray(page) ? page : [];
    for(const product of products)cacheProduct(product);
    if (append) {
      const known = new Set(state.products.map(product => Number(product.id)));
      for (const product of products) {
        const id=Number(product.id);
        if (known.has(id)) continue;
        known.add(id);
        state.products.push(product);
      }
    } else {
      state.products = products;
    }
    state.catalogOffset += products.length;
    state.catalogHasMore = products.length === CATALOG_PAGE_SIZE;
    state.catalogLoaded = true;
    return state.products;
  } finally {
    if (requestId===state.catalogRequestId) state.catalogLoading = false;
  }
}
async function loadShops() { state.shops=await api('/shops');state.shopsLoaded=true;return state.shops; }
async function loadCategories() { state.categories=await api('/products/categories');state.categoriesLoaded=true;return state.categories; }
async function loadFavorites() { if(!state.token)return; const rows=await api(`/users/me/favorites?lang=${state.language}`); state.favorites=new Set(rows.map(x=>Number(x.id||x.product_id))); }
function persistSession(){ if(state.webSession){localStorage.removeItem('izbor_web_refresh');localStorage.removeItem('mm_web_token');} localStorage.setItem('mm_web_user',JSON.stringify(withoutMediaCapabilities(state.user))); localStorage.setItem('mm_web_language',state.language); }
function clearBuyerSession(){buyerSessionEpoch++;state.token='';state.refreshToken='';state.webSession=false;state.user=null;state.favorites.clear();clearPrivateMediaImages();for(const key of ['izbor_web_refresh','mm_web_token','mm_web_user'])localStorage.removeItem(key);renderNavigation();}
async function logout(render=true){
  try{await api('/auth/web/logout',{method:'POST',auth:false,body:'{}'});}
  catch(error){toast(error.message,true);return;}
  clearBuyerSession();if(render)navigate('home');
}

function emptyState(ico='package-open', text=t('empty')) { return `<div class="empty"><div>${icon(ico,52)}<h3>${esc(text)}</h3></div></div>`; }
function errorState(error) { return `<div class="empty"><div>${icon('triangle-alert',52)}<h3>${esc(error?.message||'Не удалось загрузить данные.')}</h3><button class="button" data-retry-route>${t('retry')}</button></div></div>`; }
function pageHead(title, subtitle=''){return `<div class="page-head"><div>${subtitle?`<p class="eyebrow">${esc(subtitle)}</p>`:''}<h1>${esc(title)}</h1></div></div>`;}

function productImage(p, className, alt='', index=0, lazy=false) {
  const sources=productImageSources(p,API_BASE);
  const active=sources[index]||sources[0]||'assets/product-placeholder.svg';
  return `<img class="${className}" src="${esc(active)}" data-product-photo data-photo-sources="${esc(JSON.stringify(sources))}" alt="${esc(alt)}" ${lazy?'loading="lazy"':''} decoding="async" referrerpolicy="no-referrer">`;
}
function productCard(p) {
  const id=Number(p.id), saved=state.favorites.has(id);
  const {discount,salePrice,oldPrice}=productOfferPricing(p);
  const stock={unconfirmed:'unknown',inStock:'available',outOfStock:'unavailable'}[productAvailability(p)];
  const labels={ru:['Наличие не подтверждено','В наличии','Нет в наличии'],en:['Availability unconfirmed','In stock','Out of stock'],uz:['Mavjudligi tasdiqlanmagan','Mavjud','Mavjud emas']}[state.language]||['Наличие не подтверждено','В наличии','Нет в наличии'];
  const distance=p.distance_km??p.shop_distance_km;
  const reviews=Number(p.product_reviews_count??p.reviews_count??0);
  const canRoute=Number(p.shop_id)>0;
  return `<article class="product-card" data-product="${id}">
    <div class="product-photo"><button type="button" class="product-open" data-product="${id}" aria-label="${esc(p.title)}">${productImage(p,'product-image','',0,true)}</button>
    ${discount>0?`<span class="discount">-${Math.round(discount)}%</span>`:''}
    <button class="favorite-button ${saved?'active':''}" data-favorite="${id}" aria-pressed="${saved}" aria-label="${esc(t('favorites'))}: ${esc(p.title||'')}">${icon('heart',20)}</button></div>
    <div class="product-body">${placementLabel(p)}<h3><button class="product-title" data-product="${id}">${esc(p.title||'Товар')}</button></h3><div class="product-meta">${esc(p.shop_name||p.category||'')}</div>
    ${distance!=null&&Number.isFinite(Number(distance))?`<div class="product-distance">${icon('map-pin',13)}${Number(distance)<0.1?'&lt; 0.1':Number(distance).toFixed(1)} km</div>`:''}
    <div class="product-stock ${stock}">${labels[stock==='unknown'?0:stock==='available'?1:2]}</div>
    ${reviews>0?`<div class="rating">${icon('star',14)} <b>${Number(p.product_average_rating??p.average_rating??p.rating??0).toFixed(1)}</b><span>(${reviews})</span></div>`:''}
    <div class="price-row">${oldPrice>0?`<span class="old-price">${money(oldPrice)}</span>`:''}<span class="price">${money(salePrice)}</span></div>
    ${canRoute?`<button class="button product-route" data-store-route="${Number(p.shop_id)}">${icon('route',16)}${t('route')}</button>`:''}</div></article>`;
}
function productGrid(items){return items.length?`<div class="product-grid">${items.map(productCard).join('')}</div>`:emptyState();}
function storeCard(s){return `<button class="store-card" data-store="${Number(s.id)}"><img src="${esc(imageUrl(s.logo_url))}" alt=""><span><b>${esc(s.name||'Магазин')}</b><small class="muted">${esc(s.specialization||s.address||'')}</small></span></button>`;}

function skeletonGrid(){return '<div class="product-grid skeleton-grid" role="status" aria-label="'+esc({ru:'Загрузка товаров',en:'Loading products',uz:'Mahsulotlar yuklanmoqda'}[state.language])+'">'+Array.from({length:6},()=>'<div class="product-skeleton" aria-hidden="true"><div></div><span></span><span></span></div>').join('')+'</div>';}
async function renderHome(preview=false){
  if(!preview && (!state.catalogLoaded || Object.keys(state.catalogQuery).length)) await loadProducts();
  if(state.route!=='home')return;
  const previousIntro=$('#view .catalog-intro');
  $('#view').innerHTML=`<header class="catalog-intro"><div><p class="eyebrow">IZBOR MARKET</p><h1>${t('catalog')}</h1><p>${t('brandPromise')}</p></div><button class="button soft" data-route="map">${icon('map-pin')}${t('openMap')}</button></header>
  <section class="section category-section" aria-label="${t('categories')}"><div class="section-head"><h2>${t('categories')}</h2></div><div class="chips"><button class="chip active" data-category="">${t('all')}</button>${state.categories.map(c=>`<button class="chip" data-category="${esc(c)}">${esc(categoryTitle(c))}</button>`).join('')}</div></section>
  <section class="section"><div class="section-head"><h2>${t('allProducts')}</h2></div>${state.catalogLoaded?productGrid(state.products):skeletonGrid()}${loadMoreMarkup()}</section>
  <footer class="izbor-footer"><span>IZBOR · ${t('brandPromise')}</span><a href="https://seller.izbor.uz">${t('sellerLink')}</a></footer>`;
  if(previousIntro){const next=$('#view .catalog-intro');previousIntro.innerHTML=next.innerHTML;next.replaceWith(previousIntro);}
}

let discoveryFilters={};
async function renderCatalog(category='') {
  category=category||'';
  const language=state.language;const params={...discoveryFilters,...(category?{category}:{})}; const items=await loadProducts(params);
  if(state.route!=='catalog'||(state.routeData||'')!==category||language!==state.language)return;
  $('#view').innerHTML=catalogPageMarkup(category,items);
}

async function renderSearch(query){
  const language=state.language;const items=await loadProducts({...discoveryFilters,q:query,catalog_search:'true'});
  if(state.route!=='search'||state.routeData!==query||state.language!==language)return;
  $('#view').innerHTML=searchPageMarkup(query,items);
  const recent=[query,...storedJson('mm_web_queries',[]).filter(x=>x!==query)].slice(0,8);localStorage.setItem('mm_web_queries',JSON.stringify(recent));
}

function catalogFiltersMarkup(){
 const select=({ru:['Сортировка','Сначала новые','Сначала дешевле','Сначала дороже','По рейтингу'],en:['Sort by','Newest first','Price: low to high','Price: high to low','Top rated'],uz:['Saralash','Avval yangilari','Avval arzonlari','Avval qimmatlari','Reyting bo‘yicha']})[state.language];
 return `<form id="catalogFilters" class="catalog-filters"><label class="field"><span>${select[0]}</span><select name="sort">${['new','price_asc','price_desc','rating'].map((key,i)=>`<option value="${key}" ${key===(discoveryFilters.sort||'new')?'selected':''}>${select[i+1]}</option>`).join('')}</select></label><label class="field"><span>${esc(uiText('Цена от'))}</span><input name="min_price" type="number" min="0" step="any" value="${esc(discoveryFilters.min_price||'')}" inputmode="decimal"></label><label class="field"><span>${esc(uiText('Цена до'))}</span><input name="max_price" type="number" min="0" step="any" value="${esc(discoveryFilters.max_price||'')}" inputmode="decimal"></label><button class="button">${esc(uiText('Применить'))}</button>${Object.keys(discoveryFilters).length?`<button class="button soft" type="button" data-reset-filters>${esc(uiText('Сбросить'))}</button>`:''}</form>`;
}
function catalogPageMarkup(category,items) {
  return `${pageHead(t('catalog'),'Izbor Market')}<div class="chips"><button class="chip ${!category?'active':''}" data-category="">${t('all')}</button>${state.categories.map(c=>`<button class="chip ${category===c?'active':''}" data-category="${esc(c)}">${esc(categoryTitle(c))}</button>`).join('')}</div>${catalogFiltersMarkup()}${productGrid(items)}${loadMoreMarkup()}`;
}

function searchPageMarkup(query,items) {
  return `${pageHead(t('searchResults'),query)}${catalogFiltersMarkup()}${productGrid(items)}${loadMoreMarkup()}`;
}

function loadMoreMarkup() {
  return state.catalogHasMore
    ? `<div class="load-more-wrap"><button class="button soft" data-load-more-products>${t('loadMore')}</button></div>`
    : '';
}

async function loadMoreProducts() {
  if (state.catalogLoading || !state.catalogHasMore || !['home','catalog','search'].includes(state.route)) return;
  const route=state.route, routeData=state.routeData;
  await loadProducts(state.catalogQuery,{append:true});
  if (state.route!==route || state.routeData!==routeData) return;
  if(route==='home')await renderHome(true);
  else $('#view').innerHTML=route==='catalog' ? catalogPageMarkup(routeData||'',state.products) : searchPageMarkup(routeData||'',state.products);
  refreshIcons();
}

async function renderFavorites(){
  if(!requireAuth(()=>navigate('favorites')))return navigate('home'); const language=state.language;await loadFavorites();
  const items=await api(`/users/me/favorites?lang=${state.language}`);
  if(state.route!=='favorites'||state.language!==language)return;
  for(const product of items)cacheProduct(product);
  $('#view').innerHTML=`${pageHead(t('favorites'),'Izbor Market')}${productGrid(items)}`;
}

async function toggleFavorite(id,button){
  if(!requireAuth(()=>toggleFavorite(id,document.querySelector(`[data-favorite="${Number(id)}"]`))))return; if(button?.disabled)return;const save=!state.favorites.has(id);if(button)button.disabled=true;
  try{
  await api(`/users/me/favorites/${id}`,{method:save?'POST':'DELETE',body:save?JSON.stringify({selected_color:'',selected_size:''}):undefined});
  save?state.favorites.add(id):state.favorites.delete(id); document.querySelectorAll(`[data-favorite="${Number(id)}"]`).forEach(el=>{el.classList.toggle('active',save);el.setAttribute('aria-pressed',String(save));el.innerHTML=icon('heart',20);});refreshIcons();
  }finally{if(button)button.disabled=false;}
}

async function renderProductDetails(id){
  const language=state.language;
  const cached=getCachedProduct(id,language)?.product || state.products.find(product=>Number(product.id)===Number(id));
  if(cached){cacheProduct(cached,{language});state.activeProduct=cached;state.productImageIndex=0;renderProductDetailsBody();refreshIcons();}
  const entry=getCachedProduct(id,language);
  if(!entry?.detailed || Date.now()-entry.fetchedAt>=PRODUCT_DETAIL_CACHE_TTL_MS){
    const refresh=fetchProductDetails(id,language);
    if(!cached){
      const product=await refresh;
      if(state.route!=='product'||Number(state.routeData)!==Number(id)||state.language!==language)return;
      state.activeProduct=product;
    }else{
      refresh.then(product=>{
        if(state.route==='product'&&Number(state.routeData)===Number(id)&&state.language===language){state.activeProduct=product;renderProductDetailsBody();refreshIcons();}
      }).catch(error=>console.warn('Product detail refresh failed; showing cached data.',error));
    }
  }
  if(state.route!=='product'||Number(state.routeData)!==Number(id)||state.language!==language)return;
  const p=state.activeProduct||cached;
  if(!p)return;
  state.recent=[p,...state.recent.filter(x=>Number(x.id)!==Number(id))].slice(0,20);
  localStorage.setItem('mm_web_recent',JSON.stringify(withoutMediaCapabilities(state.recent)));
  if(!cached)renderProductDetailsBody();
}
function renderProductDetailsBody(){
  const p=state.activeProduct; if(!p)return;
  const {salePrice,oldPrice}=productOfferPricing(p);
  const images=productImageSources(p,API_BASE).filter(src=>src!==mediaUrl(p.thumbnail_url,API_BASE)||src===mediaUrl(p.image_url,API_BASE));
  const specs=[...productSpecifications(p,state.language),[t('availability'),t(productAvailability(p))]];
  $('#view').innerHTML=`<button class="back-link" data-back-catalog>${icon('arrow-left')} ${t('backToProducts')}</button>
    <section class="product-detail-page"><div class="product-gallery"><div class="detail-photo">${productImage({...p,image_url:images[state.productImageIndex]||p.image_url},'detail-image',p.title)}</div>${images.length>1?`<div class="gallery-thumbs">${images.map((src,index)=>`<button class="gallery-thumb ${index===state.productImageIndex?'active':''}" data-product-image="${index}" aria-label="${esc(t('imageLabel'))} ${index+1}">${productImage({image_url:src},'gallery-image')}</button>`).join('')}</div>`:''}</div>
    <div class="detail-info"><p class="eyebrow">${esc(categoryTitle(p.category)||'IZBOR')}</p><h1>${esc(p.title||'Товар')}</h1><p class="muted">${esc(p.shop_name||'Магазин')}</p><div class="rating">${icon('star')} <b>${Number(p.product_average_rating||p.average_rating||0).toFixed(1)}</b><span>(${Number(p.product_reviews_count||p.reviews_count||0)} ${t('reviewCount')})</span></div><div class="price-row detail-price"><span class="price">${money(salePrice)}</span>${oldPrice>0?`<span class="old-price">${money(oldPrice)}</span>`:''}</div><div class="hero-actions"><button class="button" data-store="${Number(p.shop_id)}">${icon('store')} ${t('openStore')}</button><button class="button soft" data-store-route="${Number(p.shop_id)}">${icon('route')} ${t('route')}</button><button class="button soft" data-product-chat="${Number(p.shop_id)}">${icon('message-circle')} ${t('write')}</button><button class="button ghost" data-product-reviews="${Number(p.id)}">${icon('star')} ${t('reviews')}</button></div>${buyerBranchOffers(p)}<section class="detail-section"><h2>${t('description')}</h2><p class="detail-description">${esc(p.description||t('noDescription'))}</p></section>${specs.length?`<section class="detail-section"><h2>${t('specifications')}</h2><dl class="spec-list">${specs.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section>`:''}</div></section>`;
}

function buyerBranchOffers(p){
  if(!Array.isArray(p.offers)||!p.offers.length)return '';
  return `<section class="detail-section"><h2>${esc(uiText("Где купить"))}</h2><div class="settings-list">`+p.offers.map(o=>`<button class="list-card" data-branch-offer="${Number(o.product_id)}"><span><b>${esc(o.business_name||o.shop_name)} — ${esc(o.branch_name||o.shop_name)}</b><small>${esc(o.address)}</small><small>${money(o.price)} · ${o.in_stock?'В наличии':'Нет в наличии'}</small></span></button>`).join('')+'</div></section>';
}
const storeCopy={
  ru:{follow:'Подписаться',unfollow:'Вы подписаны',following:'Подписка обновляется…',followHint:'Предложения и новости магазина — без покупки. Отписаться можно в любой момент.',search:'Поиск в этом магазине',searchButton:'Найти',share:'Поделиться',copied:'Ссылка скопирована',branches:'Филиалы',noProducts:'По вашему запросу товаров нет',reset:'Сбросить фильтры',about:'О магазине',hours:'Часы работы',call:'Позвонить',noReviews:'У магазина пока нет отзывов',subscriptionError:'Не удалось проверить подписку',unfollowLabel:'Отписаться от магазина',error:'Не удалось загрузить товары'},
  en:{follow:'Follow',unfollow:'Following',following:'Updating…',followHint:'Store offers and news, without a purchase. Unfollow at any time.',search:'Search this store',searchButton:'Search',share:'Share',copied:'Link copied',branches:'Locations',noProducts:'No products match your search',reset:'Clear filters',about:'About the store',hours:'Opening hours',call:'Call',noReviews:'No reviews yet',subscriptionError:'Could not check subscription',unfollowLabel:'Unfollow this store',error:'Could not load products'},
  uz:{follow:'Obuna bo‘lish',unfollow:'Obuna bo‘lgansiz',following:'Yangilanmoqda…',followHint:'Do‘kon takliflari va yangiliklari — xaridsiz. Istalgan vaqtda bekor qiling.',search:'Shu do‘kondan qidirish',searchButton:'Qidirish',share:'Ulashish',copied:'Havola nusxalandi',branches:'Filiallar',noProducts:'So‘rovingizga mos mahsulot yo‘q',reset:'Filtrlarni tozalash',about:'Do‘kon haqida',hours:'Ish vaqti',call:'Qo‘ng‘iroq',noReviews:'Hali sharhlar yo‘q',subscriptionError:'Obunani tekshirib bo‘lmadi',unfollowLabel:'Do‘konga obunani bekor qilish',error:'Mahsulotlarni yuklab bo‘lmadi'}
};
const st=key=>(storeCopy[state.language]||storeCopy.ru)[key];
let storePage=null,storePageRequest=0,storeProductsRequest=0;
function showStore(shopId){closeModal();return navigate('store',shopId);}
async function renderStorePage(id){
  if(!Number.isSafeInteger(id)||id<1||id>2147483647)throw new Error('Invalid store');
  const request=++storePageRequest;
  const [shop,network,reviews,subscription]=await Promise.all([
    api(`/shops/${id}`,{auth:false}),
    api(`/shops/${id}/locations`,{auth:false}).catch(()=>null),
    api(`/shops/${id}/reviews`,{auth:false}).catch(()=>null),
    state.token?api(`/shops/${id}/subscription`).catch(()=>null):Promise.resolve({subscribed:false})
  ]);
  if(request!==storePageRequest||state.route!=='store'||Number(state.routeData)!==id)return;
  const previous=storePage?.id===id?storePage:null;
  storePage={id,shop,network,reviews,subscription,busy:false,products:[],q:previous?.q||'',category:previous?.category||'',offset:0,more:false};
  const index=state.shops.findIndex(row=>Number(row.id)===id);
  if(index<0)state.shops.push(shop);else state.shops[index]=shop;
  renderStoreShell();
  await loadStoreProducts();
}
function storeFollowMarkup(){
  const page=storePage,followed=page.subscription?.subscribed===true;
  return `<button class="button store-follow ${followed?'soft':''}" data-store-follow aria-pressed="${followed}" aria-label="${esc(followed?st('unfollowLabel'):st('follow'))}" ${page.busy?'disabled':''}>${icon(followed?'bell-ring':'bell-plus')} ${esc(page.busy?st('following'):followed?st('unfollow'):st('follow'))}</button>`;
}
function renderStoreShell(){
  const page=storePage,s=page.shop;
  const phone=String(s.phone||'').replace(/[^+0-9]/g,'');
  const coordinates=s.latitude!=null&&s.longitude!=null&&Number.isFinite(Number(s.latitude))&&Number.isFinite(Number(s.longitude))&&(Number(s.latitude)!==0||Number(s.longitude)!==0);
  const branches=Array.isArray(page.network?.branches)?page.network.branches:[];
  const hours=typeof s.working_hours==='string'?s.working_hours:'';
  $('#view').innerHTML=`<div class="store-page"><button class="back-link" data-route="home">${icon('arrow-left')} ${t('catalog')}</button>
    <section class="store-header"><div class="store-identity"><img class="store-avatar" src="${esc(imageUrl(s.logo_url))}" alt="" onerror="this.onerror=null;this.src='assets/product-placeholder.svg'"><div><p class="eyebrow">IZBOR MARKET</p><h1>${esc(s.name||t('openStore'))}</h1>${page.reviews?`<button class="store-rating" data-shop-reviews>${icon('star',16)} ${Number(page.reviews.average_rating||0).toFixed(1)} · ${Number(page.reviews.reviews_count||0)} ${t('reviewCount')}</button>`:''}</div></div>
    ${s.specialization||s.category?`<p class="store-specialization">${esc(categoryTitle(s.specialization||s.category))}</p>`:''}
    ${s.description?`<p class="store-description">${esc(s.description)}</p>`:''}
    <div class="store-facts">${s.address?`<span>${icon('map-pin',17)} ${esc(s.address)}</span>`:''}${hours?`<span>${icon('clock',17)} ${esc(hours)}</span>`:''}</div>
    <div class="store-actions"><span id="storeFollow">${storeFollowMarkup()}</span><button class="button soft" data-product-chat="${page.id}">${icon('message-circle')} ${t('write')}</button><button class="button soft" data-shop-reviews>${icon('star')} ${t('reviews')}</button>${coordinates?`<button class="button soft" data-store-route="${page.id}">${icon('route')} ${t('route')}</button>`:''}${phone?`<a class="button soft" href="tel:${esc(phone)}">${icon('phone')} ${esc(st('call'))}</a>`:''}<button class="button ghost" data-store-share>${icon('share-2')} ${esc(st('share'))}</button></div>
    <p class="store-follow-note">${esc(st('followHint'))}</p><p id="storeSubscriptionStatus" role="status" class="muted">${state.token&&!page.subscription?esc(st('subscriptionError')):''}</p></section>
    ${branches.length>1?`<details class="store-branches"><summary>${esc(st('branches'))} · ${branches.length}</summary><div class="store-branch-list">${branches.map(branch=>`<button class="list-card" data-store="${Number(branch.branch_id||branch.id)}" ${Number(branch.branch_id||branch.id)===page.id?'aria-current="page"':''}><span>${icon('store')}<b>${esc(branch.branch_name||branch.name||'')}</b><small>${esc(branch.address||'')}</small></span>${icon('chevron-right')}</button>`).join('')}</div></details>`:''}
    <section class="section store-catalog"><div class="section-head"><h2>${t('catalog')}</h2></div><form id="storeSearchForm" class="store-search"><label class="store-search-field">${icon('search')}<input name="q" type="search" maxlength="200" value="${esc(page.q)}" placeholder="${esc(st('search'))}" aria-label="${esc(st('search'))}"></label><button class="button" type="submit">${esc(st('searchButton'))}</button></form>
    <div class="chips store-categories" aria-label="${esc(t('categories'))}"><button class="chip ${!page.category?'active':''}" data-store-category="" aria-pressed="${!page.category}">${t('all')}</button>${state.categories.map(c=>`<button class="chip ${page.category===c?'active':''}" data-store-category="${esc(c)}" aria-pressed="${page.category===c}">${esc(categoryTitle(c))}</button>`).join('')}</div><div id="storeProducts" aria-live="polite"></div></section></div>`;
  refreshIcons();
}
function renderStoreProducts(){
  const el=$('#storeProducts');if(!el||!storePage)return;
  el.innerHTML=storePage.products.length?`${productGrid(storePage.products)}${storePage.more?`<div class="load-more-wrap"><button class="button soft" data-store-more>${t('loadMore')}</button></div>`:''}`:`<div class="store-empty">${icon('package-open',36)}<h3>${esc(st('noProducts'))}</h3>${storePage.q||storePage.category?`<button class="button soft" data-store-reset>${esc(st('reset'))}</button>`:''}</div>`;
  refreshIcons();
}
async function loadStoreProducts(append=false){
  const page=storePage,request=++storeProductsRequest;
  const el=$('#storeProducts');if(!el)return;
  if(!append){page.offset=0;page.products=[];el.innerHTML='<div class="loader" role="status"><div class="spinner"></div></div>';}
  const more=el.querySelector('[data-store-more]');if(more)more.disabled=true;
  try{
    const params=new URLSearchParams({shop_id:String(page.id),lang:state.language,limit:'24',offset:String(page.offset)});
    if(page.q)params.set('q',page.q);if(page.category)params.set('category',page.category);
    const rows=await api('/products?'+params,{auth:false});
    if(request!==storeProductsRequest||page!==storePage||state.route!=='store'||Number(state.routeData)!==page.id)return;
    const items=Array.isArray(rows)?rows:[];items.forEach(p=>cacheProduct(p));
    const known=new Set(page.products.map(p=>Number(p.id)));page.products.push(...items.filter(p=>!known.has(Number(p.id))));
    page.offset+=items.length;page.more=items.length===24;renderStoreProducts();
  }catch(error){
    if(request!==storeProductsRequest||page!==storePage||!el.isConnected)return;
    if(append){if(more)more.disabled=false;toast(error.message,true);}
    else el.innerHTML=`<div class="store-empty"><p role="alert">${esc(uiText(error.message))}</p><button class="button soft" data-store-retry>${t('retry')}</button></div>`;
  }
}
async function toggleStoreFollow(){
  const page=storePage;if(!page||page.busy)return;
  if(!requireAuth(async()=>{await renderStorePage(page.id);if(storePage?.id===page.id&&storePage.subscription?.subscribed!==true)await toggleStoreFollow();}))return;
  page.busy=true;$('#storeFollow').innerHTML=storeFollowMarkup();refreshIcons();
  try{
    if(!page.subscription)page.subscription=await api(`/shops/${page.id}/subscription`);
    const followed=page.subscription.subscribed===true;
    const result=await api(`/shops/${page.id}/subscription`,{method:followed?'DELETE':'POST'});
    page.subscription=result;
    if(storePage===page&&$('#storeSubscriptionStatus'))$('#storeSubscriptionStatus').textContent='';
  }catch(error){toast(error.message,true);}
  finally{page.busy=false;if(storePage===page&&$('#storeFollow')){$('#storeFollow').innerHTML=storeFollowMarkup();refreshIcons();}}
}
async function showStoreReviews(){
  const page=storePage;if(!page)return;
  try{
    const data=await api(`/shops/${page.id}/reviews`,{auth:false});
    if(storePage!==page||state.route!=='store')return;
    openModal(`<div class="store-review-summary">${icon('star',24)} <b>${Number(data.average_rating||0).toFixed(1)}</b> · ${Number(data.reviews_count||0)} ${t('reviewCount')}</div><div class="settings-list">${(data.reviews||[]).map(r=>`<article class="store-review"><b>${esc(r.buyer_name||t('guest'))}</b><span>${'★'.repeat(Math.max(0,Math.min(5,Number(r.rating)||0)))}</span><small>${esc(r.product_title||'')}</small><p>${esc(r.text||'')}</p></article>`).join('')||`<p class="muted">${esc(st('noReviews'))}</p>`}</div>`,t('reviews'));
  }catch(error){toast(error.message,true);}
}

async function renderMap(){
  const filter=state.mapFilter||{q:'',category:''};state.mapFilter=filter;
  state.map?.remove();state.map=null;
  const labels={ru:['Найдите товар или выберите категорию, чтобы увидеть магазины на карте.','Найти','Товар','Категория'],en:['Search for a product or choose a category to see stores on the map.','Search','Product','Category'],uz:['Do‘konlarni xaritada ko‘rish uchun mahsulot qidiring yoki toifa tanlang.','Qidirish','Mahsulot','Toifa']}[state.language]||[];
  $('#view').innerHTML=`${pageHead(t('map'),'IZBOR')}<form id="mapFilters" class="map-filters"><label class="field"><span>${labels[2]}</span><input name="q" value="${esc(filter.q)}" placeholder="${esc(t('searchPlaceholder'))}"></label><label class="field"><span>${labels[3]}</span><select name="category"><option value="">${t('all')}</option>${state.categories.map(c=>`<option ${c===filter.category?'selected':''} value="${esc(c)}">${esc(categoryTitle(c))}</option>`).join('')}</select></label><button class="button">${labels[1]}</button></form><div class="map-layout"><div class="map-panel"><div id="mapStores" class="store-grid" style="grid-template-columns:1fr"><p role="status">${filter.q||filter.category?uiText('Загрузка…'):labels[0]}</p></div></div><div id="map" class="map-loading"><div>${icon('map-pin',48)}<b>${esc(uiText("Загружаем карту…"))}</b></div></div></div>`;
  const form=$('#mapFilters'),element=$('#map');
  const apply=()=>{state.mapFilter={q:form.elements.q.value.trim(),category:form.elements.category.value};renderMap().catch(error=>toast(error.message,true));};
  form.onsubmit=event=>{event.preventDefault();apply();};form.elements.category.onchange=apply;
  form.elements.q.oninput=()=>{if(!form.elements.q.value.trim()&&filter.q)apply();};
  try {
    let stores=[];
    if(filter.q||filter.category){
      const params={lang:state.language,limit:'300',catalog_search:'true'};if(filter.q)params.q=filter.q;if(filter.category)params.category=filter.category;
      const response=await api('/products?'+new URLSearchParams(params));
      const products=Array.isArray(response)?response:response.items||[];
      const shopResponse=await api('/shops?'+new URLSearchParams({limit:'300',...(filter.q?{q:filter.q}:{})}));
      const shops=Array.isArray(shopResponse)?shopResponse:shopResponse.items||[];
      const found=new Map();
      for(const product of products){
        const id=Number(product.shop_id);if(!id)continue;
        const known=shops.find(shop=>Number(shop.id)===id)||state.shops.find(shop=>Number(shop.id)===id)||{};
        found.set(id,{...known,id,name:product.shop_name||known.name,address:product.shop_address||known.address,logo_url:product.shop_logo_url||known.logo_url,latitude:product.shop_latitude??known.latitude,longitude:product.shop_longitude??known.longitude});
      }
      if(filter.q&&!filter.category)for(const shop of shops)if(String(shop.name||'').toLocaleLowerCase().includes(filter.q.toLocaleLowerCase()))found.set(Number(shop.id),shop);
      stores=[...found.values()].filter(shop=>shop.latitude!=null&&shop.longitude!=null&&Number.isFinite(Number(shop.latitude))&&Number.isFinite(Number(shop.longitude))&&Math.abs(Number(shop.latitude))<=90&&Math.abs(Number(shop.longitude))<=180&&(Number(shop.latitude)!==0||Number(shop.longitude)!==0));
      if(element.isConnected){const merged=new Map(state.shops.map(shop=>[Number(shop.id),shop]));for(const shop of stores)merged.set(Number(shop.id),shop);state.shops=[...merged.values()];}
    }
    if(!element.isConnected)return;
    $('#mapStores').innerHTML=filter.q||filter.category?(stores.map(storeCard).join('')||emptyState()):`<p role="status">${labels[0]}</p>`;
    try{
      const mountedMap=await mountStoreMap(element,stores,{onSelect:shop=>showStore(Number(shop.id)).catch(error=>toast(error.message,true))});
      if(!element.isConnected){mountedMap?.remove();return;}state.map=mountedMap;refreshIcons();
    }catch(error){if(element.isConnected)element.innerHTML=`<div class="map-fallback"><h2>${esc(uiText('Яндекс.Карта недоступна'))}</h2><p>${esc(error.message)}</p></div>`;}
  }catch(error){if(element.isConnected){$('#mapStores').innerHTML=errorState(error);element.innerHTML=`<div class="map-fallback"><h2>${esc(uiText("Яндекс.Карта недоступна"))}</h2><p>`+esc(error.message)+'</p></div>';}}
}

async function openRoute(shopId){
  let shop=state.shops.find(s=>Number(s.id)===shopId);
  if(!shop){try{shop=await api(`/shops/${shopId}`,{auth:false});state.shops.push(shop);}catch(error){toast(uiText(error.message),true);return;}}
  openModal(routePreviewMarkup(shop),t('route'),true);
  const host=$('#modalRoot .route-preview');
  const dispose=await mountRoutePreview(host,{shop,request:(path,options)=>api(path,{...options,auth:false})});
  if(!host.isConnected)dispose();else modalCleanup=dispose;
}


async function renderChats(initialChat){
 if(!requireAuth(()=>navigate('chats',initialChat)))return navigate('home');
 $('#view').innerHTML=`${pageHead(t('chats'),'Izbor Market')}<div id="buyerChats"></div>`;
 const host=$('#buyerChats');
 const dispose=await mountChats(host,{api:{request:(path,options={})=>api(path,{...options,...(options.body!==undefined&&!(options.body instanceof FormData)?{body:JSON.stringify(options.body)}:{})})},baseUrl:API_BASE,role:'buyer',initialChat});
 if(!host.isConnected)dispose();else chatCleanup=dispose;
}
async function startChat(shopId){if(!requireAuth(()=>startChat(shopId)))return;const chat=await api('/chats',{method:'POST',body:JSON.stringify({shop_id:shopId})});closeModal();await navigate('chats',Number(chat.chat_id||chat.id));}

async function renderNotifications(){
  if(!requireAuth(()=>navigate('notifications')))return navigate('home');const data=await api('/users/me/notifications');$('#notificationDot').classList.add('hidden');await api('/users/me/notifications/read-all',{method:'PUT',body:'{}'});
  $('#view').innerHTML=`${pageHead(t('notifications'),'Izbor Market')}<div class="settings-list">${data.notifications?.length?data.notifications.map(n=>`<button class="list-card" data-store="${Number(n.shop_id)}"><span class="list-icon">${icon('bell')}</span><span><b>${esc(n.shop_name)}</b><small>${esc(n.text)}</small></span>${icon('chevron-right')}</button>`).join(''):emptyState('bell-off')}</div>`;
}
async function checkNotifications(){try{const d=await api('/users/me/notifications?limit=1');$('#notificationDot').classList.toggle('hidden',!Number(d.unread_count));}catch{}}

function buyerProfileText(ru,en,uz){return state.language==='en'?en:state.language==='uz'?uz:ru;}
function buyerProfileMenu({symbol,title,subtitle='',attributes='',href='',destructive=false}){
  const tag=href?'a':'button',action=href?`href="${esc(href)}"`:`type="button" ${attributes}`;
  return `<${tag} class="buyer-profile-menu${destructive?' is-destructive':''}" ${action}><span class="buyer-profile-menu-icon">${icon(symbol,21)}</span><span class="buyer-profile-menu-copy"><strong>${esc(title)}</strong>${subtitle?`<small>${esc(subtitle)}</small>`:''}</span>${icon('chevron-right',22)}</${tag}>`;
}
async function renderProfile(){
  const tr=buyerProfileText,menu=buyerProfileMenu,loggedIn=Boolean(state.token);
  const section=(title,content)=>`<section class="buyer-profile-section"><h2>${esc(title)}</h2><div class="buyer-profile-menu-list">${content}</div></section>`;
  const name=state.user?.name||tr('Покупатель','Buyer','Xaridor');
  const identity=loggedIn?`<button type="button" class="buyer-profile-identity" data-account>
    <span class="buyer-profile-avatar">${state.user?.avatar_url?`<img src="${esc(imageUrl(state.user.avatar_url))}" alt="${esc(name)}">`:icon('user-round',38)}<span class="buyer-profile-camera">${icon('camera',15)}</span></span>
    <span class="buyer-profile-identity-copy"><strong>${esc(name)}</strong><span>${esc(state.user?.phone||tr('Номер пользователя не указан','Phone number is not set','Telefon raqami ko‘rsatilmagan'))}</span><small>ID: #${esc(state.user?.id||'—')}</small></span>
  </button>`:`<section class="buyer-profile-guest">${icon('user-round',46)}<h2>${esc(tr('Войдите в Izbor','Sign in to Izbor','Izborga kiring'))}</h2><p>${esc(tr('Сохраняйте товары, общайтесь с магазинами и используйте персональные функции.','Save products, message stores and use personal features.','Mahsulotlarni saqlang, do‘konlar bilan yozishing va shaxsiy funksiyalardan foydalaning.'))}</p><button class="button" data-auth>${t('login')}</button></section>`;
  $('#view').innerHTML=`<div class="buyer-style-profile"><header class="buyer-profile-heading"><h1>${t('profile')}</h1></header>${identity}
    ${loggedIn?`<section class="buyer-profile-wallet"><header>${icon('wallet',24)}<h2>${esc(tr('Кошелёк Izbor','Izbor Wallet','Izbor Hamyon'))}</h2></header><p>${esc(tr('Талоны, скидки, гарантии и предложения магазинов','Loyalty cards, discounts, warranties and store offers','Talonlar, chegirmalar, kafolatlar va do‘kon takliflari'))}</p><div><button type="button" data-wallet>${esc(tr('Открыть кошелёк','Open wallet','Hamyonni ochish'))}${icon('chevron-right',18)}</button><button type="button" data-wallet-qr>${icon('store',18)}${esc(tr('Мои магазины','My stores','Mening do‘konlarim'))}</button></div></section>`:''}
    ${section(tr('НАСТРОЙКИ И ПРЕДПОЧТЕНИЯ','SETTINGS','SOZLAMALAR'),[
      loggedIn?menu({symbol:'user-round',title:t('account'),subtitle:tr('Имя, телефон и фото','Name, phone and photo','Ism, telefon va rasm'),attributes:'data-account'}):'',
      loggedIn?menu({symbol:'heart',title:t('favorites'),attributes:'data-route="favorites"'}):'',
      loggedIn?menu({symbol:'sparkles',title:tr('Мои интересы','My interests','Qiziqishlarim'),subtitle:tr('Категории для рекомендаций','Categories for recommendations','Tavsiyalar uchun toifalar'),attributes:'data-interests'}):'',
      menu({symbol:'languages',title:tr('Язык интерфейса','App language','Ilova tili'),subtitle:'Русский, English, O‘zbekcha',attributes:'data-action="language"'}),
      menu({symbol:'palette',title:tr('Оформление','Appearance','Ko‘rinish'),subtitle:tr('Системная, светлая или тёмная тема','System, light or dark theme','Tizim, yorug‘ yoki qorong‘i mavzu'),attributes:'data-appearance-open'}),
    ].join(''))}
    ${section(tr('ПОМОЩЬ И СЕРВИС','HELP AND SERVICE','YORDAM VA XIZMAT'),[
      menu({symbol:'headset',title:t('help'),attributes:'data-help'}),
      menu({symbol:'shield',title:tr('Политика конфиденциальности','Privacy policy','Maxfiylik siyosati'),href:`${API_BASE}/legal/buyer/privacy`}),
      menu({symbol:'file-text',title:tr('Условия использования','Terms of use','Foydalanish shartlari'),href:`${API_BASE}/legal/buyer/terms`}),
      menu({symbol:'store',title:tr('Стать продавцом','Become a seller','Sotuvchi bo‘lish'),href:'https://seller.izbor.uz'}),
    ].join(''))}
    ${loggedIn?section(tr('АККАУНТ','ACCOUNT','AKKAUNT'),menu({symbol:'log-out',title:tr('Выйти из аккаунта','Sign out','Akkauntdan chiqish'),attributes:'data-profile-signout',destructive:true})):''}
  </div>`;
  refreshIcons();
}
function confirmProfileSignout(){
  const tr=buyerProfileText;
  openModal(`<div class="buyer-profile-signout"><span class="buyer-profile-signout-icon">${icon('log-out',27)}</span><p>${esc(tr('Вы сможете войти снова по номеру телефона и коду.','You can sign in again with your phone number and a code.','Telefon raqamingiz va kod orqali qayta kirishingiz mumkin.'))}</p><div><button type="button" class="button soft" data-close-modal>${esc(tr('Отмена','Cancel','Bekor qilish'))}</button><button type="button" class="button" data-logout>${t('logout')}</button></div></div>`,t('logout'));
}

async function showWallet(){
 const data=await api('/users/me/subscriptions');const codes=[];
 const labels={ACTIVE:'Действует',USED:'Использована',REDEEMED:'Использована',EXPIRED:'Истекла',AVAILABLE:'Доступно'};
 const section=(title,items,warranty=false)=>`<section class="section"><h2>${esc(title)}</h2>${items.length?`<div class="workspace-records">${items.map(item=>{
  const qr=warranty&&item.status==='ACTIVE'&&item.qr_token?codes.push(item.qr_token)-1:null;
  return `<article class="workspace-record"><h3>${esc(item.title||item.device_name||item.product_name||item.shop_name||title)}</h3><p>${esc(item.shop_name||'')}</p><p>${esc(item.description||'')}</p><span class="status">${esc(uiText(labels[item.status]||item.status||''))}</span>${item.ends_at?`<p>${esc(uiText('Действует до'))}: ${esc(new Date(item.ends_at).toLocaleDateString(state.language))}</p>`:''}${item.discount_percent?`<strong>−${Number(item.discount_percent)}%</strong>`:''}${qr!==null?`<div class="warranty-qr"><canvas data-warranty-qr="${qr}" aria-label="${esc(uiText('QR гарантии'))}"></canvas><small>${esc(uiText('Покажите продавцу для погашения гарантии'))}</small></div>`:''}</article>`;
 }).join('')}</div>`:emptyState()}</section>`;
 openModal(`${section(uiText('Талоны'),data.loyalty_cards||[])}${section(uiText('Скидки'),data.discounts||[])}${section(uiText('Гарантии'),data.warranties||[],true)}${section(uiText('Предложения'),data.offers||[])}`,t('wallet'),true);
 for(const canvas of document.querySelectorAll('[data-warranty-qr]')){try{await window.QRCode.toCanvas(canvas,codes[Number(canvas.dataset.warrantyQr)],{width:200,margin:2});}catch{canvas.replaceWith(document.createTextNode(uiText('Не удалось показать QR. Повторите попытку.')));}}
}
async function showQr(){const stores=await api('/users/me/subscribed-shops');openModal(`<div class="settings-list">${stores.length?stores.map(shop=>`<button class="list-card" data-store="${Number(shop.id)}"><span><b>${esc(shop.name||shop.shop_name||'Магазин')}</b><small>${esc(shop.address||'')}</small></span></button>`).join(''):`<p>${esc(uiText("Отсканируйте QR магазина, чтобы подписаться. Покупка не требуется."))}</p>`}</div>`,'Мои магазины',false);}

function showAccount(){openModal(`<form id="accountForm" class="form"><div class="field"><label>${esc(uiText("Фото профиля"))}</label><input type="file" name="avatar" accept="image/jpeg,image/png,image/webp"></div><div class="field"><label>${esc(uiText("Имя"))}</label><input name="name" required value="${esc(state.user.name)}"></div><div class="field"><label>${esc(uiText("Телефон"))}</label><input disabled value="${esc(state.user.phone||'')}"></div><button class="button">${t('save')}</button><button type="button" class="button danger" data-delete-account>${t('deleteAccount')}</button></form>`,t('account'));const identities=document.createElement('section');document.querySelector('.modal-body').append(identities);mountTelegramLink(identities,{client:'buyer',language:state.language,request:(path,options={})=>api(path,{...options,body:options.body?JSON.stringify(options.body):undefined})});}
async function showSavedCard(){localStorage.removeItem('mm_web_card');try{openModal(paymentStateView(await api('/marketplace/payments/capabilities')),'Оплата');}catch(error){toast(error.message,true);}}
async function showInterests(){const current=await api('/users/me/preferences').catch(()=>({categories:[]}));const selected=new Set(current.categories||[]);openModal(`<form id="interestsForm" class="form"><p class="muted">${esc(uiText(current.completed?'Выбранные категории используются для персональных рекомендаций.':'Выберите ровно три категории для персональных рекомендаций.'))}</p><div class="chips">${state.categories.map(c=>`<label class="chip ${selected.has(c)?'active':''}"><input type="checkbox" name="category" value="${esc(c)}" ${selected.has(c)?'checked':''} ${current.completed?'disabled':''} hidden>${esc(categoryTitle(c))}</label>`).join('')}</div>${current.completed?'':`<button class="button">${t('save')}</button>`}</form>`,'Мои интересы');}

function showHelp(){const topics=[['search','Поиск и карта','Товары, магазины, расстояние и маршрут'],['archive','Товары, каталог и избранное','Цена, скидка, наличие и сохранённые товары'],['star','Отзывы и рейтинги','Оценка товара после покупки'],['shield','Безопасность и поддержка','Аккаунт, данные и помощь']];openModal(`<div class="settings-list">${topics.map(x=>`<div class="list-card"><span class="list-icon">${icon(x[0])}</span><span><b>${esc(uiText(x[1]))}</b><small>${esc(uiText(x[2]))}</small></span>${icon('chevron-right')}</div>`).join('')}</div>`,t('help'));}
function showLanguage(){openModal(`<div class="settings-list">${[['ru','Русский'],['en','English'],['uz','O‘zbekcha']].map(([code,label])=>`<button class="list-card" data-language="${code}"><span class="list-icon">${code===state.language?icon('check'):icon('languages')}</span><span><b>${label}</b></span></button>`).join('')}</div>`,t('language'));}

const buyerAuth=createBuyerAuth({api,apiBase:API_BASE,language:()=>state.language,escape:esc,openModal,closeModal,
  async onSession(data,after){if(data.web_session!==true)throw new Error('Сначала обновите backend для сохранения входа.');buyerSessionEpoch++;state.webSession=true;state.token=data.token;state.refreshToken='';state.user=data.user;persistSession();renderNavigation();await loadFavorites().catch(error=>toast(error.message,true));if(typeof after==='function')await after();else await navigate('home',null,{fromHistory:true});}
});
function showAuth(after){buyerAuth.open(after);}

let modalReturnFocus,modalCleanup=()=>{};
function openModal(content,title='',wide=false,{preserveAuth=false}={}){
  modalCleanup();modalCleanup=()=>{};
  if(!preserveAuth)buyerAuth.cancel();
  if(!$('#modalRoot').firstElementChild)modalReturnFocus=document.activeElement;
  $('#modalRoot').innerHTML=`<div class="modal-backdrop"><div role="dialog" aria-modal="true" aria-labelledby="buyerModalTitle" tabindex="-1" class="modal ${wide?'wide':''}"><div class="modal-head"><h2 id="buyerModalTitle">${esc(uiText(title))}</h2><button class="icon-button" aria-label="${esc(({ru:'Закрыть',en:'Close',uz:'Yopish'})[state.language]||'Close')}" data-close-modal>${icon('x')}</button></div><div class="modal-body">${content}</div></div></div>`;
  refreshIcons();
  const dialog=$('#modalRoot [role="dialog"]');
  const focusable=()=>Array.from(dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')).filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();closeModal();return;}
    if(event.key!=='Tab')return;
    const items=focusable(),first=items[0],last=items.at(-1);
    if(!first){event.preventDefault();dialog.focus();return;}
    if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first.focus();}
  });
  (focusable()[0]||dialog).focus();
}
function closeModal(){ modalCleanup();modalCleanup=()=>{};buyerAuth.cancel();$('#modalRoot').innerHTML='';if(modalReturnFocus?.isConnected)modalReturnFocus.focus();modalReturnFocus=null; }

async function showReviews(productId){const d=await api(`/products/${productId}/reviews`);openModal(`<div class="stat"><small>${esc(uiText("Средняя оценка"))}</small><b>${Number(d.average_rating||0).toFixed(1)} ★</b></div><div class="settings-list" style="margin-top:14px">${(d.reviews||[]).map(r=>`<div class="list-card"><span class="avatar">${esc((r.buyer_name||'П')[0])}</span><span><b>${esc(r.buyer_name||'Покупатель')} · ${'★'.repeat(Number(r.rating||0))}</b><small>${esc(r.text||'')}</small></span></div>`).join('')||emptyState()}</div>${state.token?`<form id="reviewForm" class="form section" data-product-id="${productId}"><div class="field"><label>${esc(uiText("Оценка"))}</label><select name="rating"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div><div class="field"><label>${esc(uiText("Комментарий"))}</label><textarea name="text"></textarea></div><button class="button">${t('send')}</button></form>`:''}`,t('reviews'));
}

function bindGlobalEvents(){
  window.addEventListener('popstate',()=>{closeModal();const next=readRouteHash()||{route:'home',data:null};navigate(next.route,next.data,{fromHistory:true});});
  document.addEventListener('click',event=>{if(event.target.closest('[data-ranking]')){event.stopPropagation();navigate('ranking');}},true);
  document.addEventListener('click',async event=>{
    if(event.target.closest('[data-store-follow]')){await toggleStoreFollow();return;}
    if(event.target.closest('[data-shop-reviews]')){await showStoreReviews();return;}
    const storeCategory=event.target.closest('[data-store-category]');
    if(storeCategory&&storePage){storePage.category=storeCategory.dataset.storeCategory;renderStoreShell();await loadStoreProducts();return;}
    if(event.target.closest('[data-store-more]')){await loadStoreProducts(true);return;}
    if(event.target.closest('[data-store-retry]')){await loadStoreProducts();return;}
    if(event.target.closest('[data-store-reset]')&&storePage){storePage.q='';storePage.category='';renderStoreShell();await loadStoreProducts();return;}
    if(event.target.closest('[data-store-share]')&&storePage){
      const url=`https://izbor.uz/shop/?id=${storePage.id}`;
      try{if(navigator.share)await navigator.share({title:storePage.shop.name,url});else{await navigator.clipboard.writeText(url);toast(st('copied'));}}catch(error){if(error.name!=='AbortError')toast(uiText(error.message),true);}return;
    }
    if(event.target.closest('[data-reset-filters]')){discoveryFilters={};await navigate(state.route,state.routeData);return;}
    const moreProducts=event.target.closest('[data-load-more-products]');if(moreProducts){moreProducts.disabled=true;loadMoreProducts().catch(error=>{if(moreProducts.isConnected)moreProducts.disabled=false;toast(error.message,true);});return;}
    const retryRoute=event.target.closest('[data-retry-route]');if(retryRoute){const route=state.route,routeData=state.routeData;try{if(route==='home'){const pending=[];if(!state.catalogLoaded)pending.push(loadProducts());if(!state.shopsLoaded)pending.push(loadShops());if(!state.categoriesLoaded)pending.push(loadCategories());const results=await Promise.allSettled(pending);const failed=results.find(result=>result.status==='rejected');if(failed)throw failed.reason;}await navigate(route,routeData);}catch(error){$('#view').innerHTML=errorState(error);}return;}
    const offer=event.target.closest('[data-branch-offer]');if(offer){const p=state.activeProduct,o=p?.offers?.find(x=>Number(x.product_id)===Number(offer.dataset.branchOffer));if(o){state.activeProduct={...p,id:o.product_id,price:o.price,old_price:o.old_price,in_stock:o.in_stock,stock_quantity:o.stock_quantity,shop_id:o.shop_id,shop_name:o.shop_name,branch_name:o.branch_name,business_name:o.business_name,shop_address:o.address,shop_phone:o.phone,shop_working_hours:o.working_hours,shop_latitude:o.latitude,shop_longitude:o.longitude};const known=state.shops.find(s=>Number(s.id)===Number(o.shop_id));if(!known)state.shops.push({id:o.shop_id,name:o.shop_name,address:o.address,latitude:o.latitude,longitude:o.longitude});renderProductDetailsBody();refreshIcons();}return;}
    const route=event.target.closest('[data-route]');if(route){closeModal();navigate(route.dataset.route);return;}
    const close=event.target.closest('[data-close-modal]');if(close||event.target.classList.contains('modal-backdrop')){closeModal();return;}
    const routeStore=event.target.closest('[data-store-route]');if(routeStore){openRoute(Number(routeStore.dataset.storeRoute));return;}
    const product=event.target.closest('[data-product]');if(product&&!event.target.closest('[data-favorite]')){state.productStoreOrigin=state.route==='store'?Number(state.routeData):null;navigate('product',Number(product.dataset.product));return;}
    const fav=event.target.closest('[data-favorite]');if(fav){event.stopPropagation();toggleFavorite(Number(fav.dataset.favorite),fav).catch(error=>toast(error.message,true));return;}
    const cat=event.target.closest('[data-category]');if(cat){navigate('catalog',cat.dataset.category);return;}
    const store=event.target.closest('[data-store]');if(store){showStore(Number(store.dataset.store)).catch(error=>toast(error.message,true));return;}
    const chatStart=event.target.closest('[data-product-chat]');if(chatStart){startChat(Number(chatStart.dataset.productChat)).catch(error=>toast(error.message,true));return;}
    if(event.target.closest('[data-auth]')){showAuth();return;}
    if(event.target.closest('[data-profile-signout]')){confirmProfileSignout();return;}
    if(event.target.closest('[data-logout]')){closeModal();logout();return;}
    if(event.target.closest('[data-wallet-qr]')){showQr().catch(e=>toast(e.message,true));return;}
    if(event.target.closest('[data-wallet]')){showWallet().catch(e=>toast(e.message,true));return;}
    if(event.target.closest('[data-account]')){showAccount();return;}
    if(event.target.closest('[data-saved-card]')){showSavedCard();return;}
    if(event.target.closest('[data-interests]')){showInterests().catch(e=>toast(e.message,true));return;}
    if(event.target.closest('[data-help]')){showHelp();return;}
    if(event.target.closest('[data-action="language"]')){showLanguage();return;}
    const lang=event.target.closest('[data-language]');if(lang){const route=state.route,routeData=state.routeData;state.language=['ru','en','uz'].includes(lang.dataset.language)?lang.dataset.language:'ru';state.catalogRequestId++;state.catalogLoading=false;state.catalogLoaded=false;state.categoriesLoaded=false;state.products=[];state.activeProduct=null;document.documentElement.lang=state.language;persistSession();closeModal();renderNavigation();document.dispatchEvent(new window.Event('izbor:language-changed'));await navigate(route,routeData,{fromHistory:true});return;}
    if(event.target.closest('[data-auth-phone]')){buyerAuth.changePhone();return;}
    if(event.target.closest('[data-auth-resend]')){await buyerAuth.resend();return;}
    if(event.target.closest('[data-product-image]')){state.productImageIndex=Number(event.target.closest('[data-product-image]').dataset.productImage);renderProductDetailsBody();refreshIcons();return;}
    if(event.target.closest('[data-back-catalog]')){if(state.productStoreOrigin)await showStore(state.productStoreOrigin);else navigate('catalog');return;}
    const reviews=event.target.closest('[data-product-reviews]');if(reviews){showReviews(Number(reviews.dataset.productReviews));return;}
    if(event.target.closest('[data-delete-account]')){if(confirm('Удалить аккаунт без возможности восстановления?')){await api('/users/me',{method:'DELETE'});closeModal();logout();}return;}
    if(event.target.closest('[data-remove-card]')){localStorage.removeItem('mm_web_card');closeModal();toast('Карта удалена');return;}
  });
  document.addEventListener('submit',async event=>{
    event.preventDefault();const form=event.target;
    try{
      if(form.id==='catalogFilters'){const values=new FormData(form),next={sort:String(values.get('sort')||'new')};for(const key of ['min_price','max_price']){const value=String(values.get(key)||'').trim();if(value)next[key]=value;}if(next.min_price&&next.max_price&&Number(next.min_price)>Number(next.max_price))throw new Error(uiText('Минимальная цена не должна превышать максимальную'));discoveryFilters=next;await navigate(state.route,state.routeData);return;}
      if(form.id==='storeSearchForm'&&storePage){storePage.q=String(new FormData(form).get('q')||'').trim();await loadStoreProducts();return;}
      if(form.id==='authForm'){await buyerAuth.submit(form,event.submitter?.value);return;}
      if(form.id==='accountForm'){const fd=new FormData(form);const d=await api('/users/me/profile',{method:'PUT',body:JSON.stringify({name:fd.get('name'),language_code:state.language})});state.user=d.user;const avatar=fd.get('avatar');if(avatar?.size){const upload=new FormData();upload.append('avatar',avatar);const avatarResult=await api('/users/me/avatar',{method:'PUT',body:upload});state.user=avatarResult.user||state.user;}persistSession();closeModal();renderProfile();}
      if(form.id==='interestsForm'){const fd=new FormData(form);const categories=fd.getAll('category');if(categories.length!==3)throw new Error('Выберите ровно три категории.');await api('/users/me/preferences',{method:'POST',body:JSON.stringify({categories})});closeModal();toast('Интересы сохранены');}
      if(form.id==='reviewForm'){const fd=new FormData(form);await api(`/products/${form.dataset.productId}/reviews`,{method:'POST',body:JSON.stringify({rating:Number(fd.get('rating')),text:fd.get('text')})});closeModal();toast('Отзыв сохранён');}
    }catch(error){toast(error.message,true);}
  });
  const suggest=debounce(async (event,requestId)=>{if(requestId!==state.searchSuggestionId)return;const q=event.target.value.trim();$('#clearSearch').classList.toggle('hidden',!q);if(!q){$('#searchSuggestions').classList.add('hidden');return;}try{const rows=await api(`/search/suggestions?q=${encodeURIComponent(q)}&lang=${state.language}`);if(requestId!==state.searchSuggestionId)return;$('#searchSuggestions').innerHTML=rows.slice(0,8).map(x=>`<button class="suggestion" data-search="${esc(x.title||x.text||x.query||'')}">${icon('search')} ${esc(x.title||x.text||x.query||'')}</button>`).join('');$('#searchSuggestions').classList.toggle('hidden',!rows.length);refreshIcons();}catch{}},250);
  $('#globalSearch').addEventListener('input',event=>suggest(event,++state.searchSuggestionId));
  $('#globalSearch').addEventListener('keydown',event=>{if(event.key==='Enter'){const q=event.target.value.trim();if(q){$('#searchSuggestions').classList.add('hidden');navigate('search',q);}}});
  $('#clearSearch').addEventListener('click',()=>{state.searchSuggestionId++;$('#globalSearch').value='';$('#clearSearch').classList.add('hidden');$('#searchSuggestions').classList.add('hidden');});
  document.addEventListener('change',event=>{if(event.target.matches('#interestsForm input[type="checkbox"]'))event.target.closest('.chip')?.classList.toggle('active',event.target.checked);});
  document.addEventListener('click',event=>{const s=event.target.closest('[data-search]');if(s){$('#globalSearch').value=s.dataset.search;$('#searchSuggestions').classList.add('hidden');navigate('search',s.dataset.search);}});
}
function debounce(fn,delay){let id;return(...args)=>{clearTimeout(id);id=setTimeout(()=>fn(...args),delay);};}

window.IZBOR_BUYER_STARTED=true;
window.dispatchEvent(new window.Event('yaqintop:started'));
bootstrap().catch(error=>{console.error(error);$('#view').innerHTML=errorState(error);refreshIcons();});

if(sessionStorage.getItem('izbor.telegram.pending.buyer'))buyerAuth.resume();
