const id=new URL(location.href).searchParams.getAll('id');
const valid=id.length===1&&/^[1-9][0-9]{0,9}$/.test(id[0])&&Number(id[0])<=2147483647;
const title=document.querySelector('#title'),status=document.querySelector('#status'),catalog=document.querySelector('#catalog'),retry=document.querySelector('#retry');
async function load(){
 retry.hidden=true;
 if(!valid){title.textContent='Некорректная ссылка магазина';status.textContent='Попросите продавца показать QR магазина.';return;}
 try{
  const response=await fetch('https://api.izbor.uz/shops/'+id[0],{signal:globalThis.AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error(response.status===404?'Магазин не найден.':'Магазин временно недоступен.');
  const shop=await response.json();title.textContent=shop.name||'Магазин';status.textContent=shop.address||'Каталог и предложения магазина';
  catalog.href='/?shop='+id[0]+'&source=qr';catalog.hidden=false;
  const configured=window.IZBOR_CONFIG?.BUYER_APP_STORE_URL;
  let store;try{store=new URL(configured);}catch{}
  if(store?.protocol==='https:'&&store.hostname==='apps.apple.com'&&!store.username&&!store.password&&/\/id[0-9]+(?:$|\/)/.test(store.pathname)){
   const button=document.querySelector('#download');button.href=store.href;button.hidden=false;document.querySelector('#release').textContent='После установки повторно отсканируйте QR — откроется этот магазин.';
   if(/iPhone|iPad|iPod/.test(navigator.userAgent))location.replace(store.href);
  }
 }catch(error){status.textContent=error.message==='Магазин не найден.'?error.message:'Не удалось открыть магазин. Проверьте соединение и повторите.';retry.hidden=false;}
}
retry.addEventListener('click',load);load();
