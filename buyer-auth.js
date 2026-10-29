import {authText,authErrorText,translateAuth} from './shared/auth-copy.js';
import {otpMarkup,bindOtp,resendCountdown} from './shared/auth-otp.js?v=20261023-otp';
import {createTelegramWebLogin} from './shared/telegram-auth.js';
// The buyer app uses phone verification for both sign-in and registration.
export function createBuyerAuth({api, apiBase, language, escape, openModal, closeModal, onSession}) {
  let current = null, stopCountdown=()=>{};
  const telegram=createTelegramWebLogin({client:'buyer',request:(path,options)=>api(path,{...options,body:JSON.stringify(options.body)})});
  const getForm = () => document.querySelector('#authForm');
  function render() {
    const flow = current;
    if (!flow) return;
    let fields;
    if (flow.stage === 'telegram') {
      fields=`<label class="auth-legal"><input type="checkbox" name="legal" required> Принимаю <a href="${escape(apiBase)}/legal/buyer/terms" target="_blank" rel="noopener">условия</a> и <a href="${escape(apiBase)}/legal/buyer/privacy" target="_blank" rel="noopener">политику конфиденциальности</a></label><button class="button auth-primary"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 3-4 18-6-6-4 3 1-7 13-8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m8 11 9-5-6 9" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><span>Продолжить через Telegram</span></button><div class="auth-divider"><span>или</span></div><button type="button" class="button soft auth-secondary" data-auth-phone><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M10 18h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span>Получить SMS-код</span></button>`;
    } else if (flow.stage === 'phone') {
      fields = `<div class="field"><label for="authPhone">Номер телефона</label><div class="auth-phone"><span>+998</span><input id="authPhone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="90 123 45 67" value="${escape(flow.phone.slice(4))}" required></div><small class="field-note">Введите 9 цифр после +998. Код придёт по SMS.</small></div><button class="button soft" name="channel" value="sms">Получить код через SMS</button>`;
    } else if (flow.stage === 'code') {
      fields = `<p class="auth-copy">Код отправлен по SMS на ${escape(flow.phone)}.</p>${otpMarkup(flow.codeLength)}<button class="button">Подтвердить</button><button type="button" class="button soft auth-resend" data-auth-resend>Получить новый код по SMS</button><div class="auth-code-links"><button type="button" class="button ghost auth-text-button" data-auth-phone>Изменить номер</button><button type="button" class="button ghost auth-text-button" data-auth-telegram>Вернуться к Telegram</button></div>`;
    } else {
      fields = `<div class="field"><label for="authName">Ваше имя</label><input id="authName" name="name" autocomplete="name" maxlength="100" placeholder="Например, Лола" required></div><label class="auth-legal"><input type="checkbox" name="legal" required><span>Я принимаю <a href="${escape(apiBase)}/legal/buyer/terms" target="_blank" rel="noopener">условия использования</a> и <a href="${escape(apiBase)}/legal/buyer/privacy" target="_blank" rel="noopener">политику конфиденциальности</a>.</span></label><button class="button">Создать аккаунт</button>`;
    }
    stopCountdown();
    document.querySelector('.modal-body').innerHTML = `<div class="auth-intro${flow.stage==='code'?' auth-code-intro':''}"><img class="auth-logo" src="assets/izbor-icon-192.png?v=20261029-round" width="62" height="62" loading="eager" decoding="sync" fetchpriority="high" alt="Izbor Market"><div><p class="eyebrow">Izbor Market</p><h2 id="authIntroTitle">${flow.stage === 'code' ? 'Введите код из SMS' : flow.stage === 'phone' ? 'Номер телефона' : flow.stage === 'name' ? 'Создание аккаунта' : 'Вход для покупателей'}</h2>${flow.stage==='code'?'':'<p class="auth-copy">Один аккаунт для покупок и работы в IZBOR. Telegram или номер телефона.</p>'}</div></div><form id="authForm" class="form">${fields}<p id="authError" class="auth-error" role="alert" hidden></p></form>`;
    const modal = document.querySelector('.modal-body').closest('[role=dialog]');
    modal?.classList.add('auth-dialog');
    modal?.classList.toggle('auth-code-stage',flow.stage==='code');
    if(modal)modal.scrollTop=0;
    modal?.setAttribute('aria-labelledby', 'authIntroTitle');
    translateAuth(document.querySelector('.modal-body'),language());
    bindOtp(document.querySelector('.modal-body'));
    const resend=document.querySelector('[data-auth-resend]');
    if(resend)stopCountdown=resendCountdown(resend,(flow.resendAt-Date.now())/1000,{label:authText('Получить новый код по SMS',language())});
    document.querySelector('[data-auth-telegram]')?.addEventListener('click',()=>{flow.stage='telegram';render();});
  }
  async function submit(form, channel) {
    const flow = current;
    if (!flow || flow.busy) return;
    const fd = new FormData(form);
    const errorElement = document.querySelector('#authError');
    errorElement.hidden = true;
    try {
      if(flow.stage==='telegram'){if(!fd.has('legal'))throw new Error('Примите условия.');flow.busy=true;location.assign(await telegram.start());return;}
      let endpoint, payload;
      if (flow.stage === 'phone' || channel) {
        if (flow.stage === 'phone') {const digits=String(fd.get('phone')||'').replace(/\D/g,'');flow.phone='+'+(digits.length===12&&digits.startsWith('998')?digits:'998'+digits);}
        if (!/^\+998\d{9}$/.test(flow.phone)) throw new Error('Введите 9 цифр после +998.');
        endpoint = 'request';
        payload = {phone: flow.phone, client: 'buyer', channel: 'sms'};
      } else if (flow.stage === 'code') {
        const code = String(fd.get('code') || '').trim();
        if (!new RegExp(`^\\d{${flow.codeLength}}$`).test(code)) throw new Error(`Введите код из ${flow.codeLength} цифр.`);
        endpoint = 'verify';
        payload = {phone: flow.phone, client: 'buyer', code};
      } else {
        const name = String(fd.get('name') || '').trim();
        if (!name || !fd.has('legal')) throw new Error('Введите имя и примите условия.');
        endpoint = 'complete';
        payload = {signup_token: flow.signupToken, name, language_code: language(), accept_privacy: true, accept_terms: true};
      }
      flow.busy = true;
      form.querySelectorAll('button,input').forEach(element => element.disabled = true);
      const data = await api(`/auth/account/phone/${endpoint}`, {method: 'POST', auth: false, body: JSON.stringify(payload)});
      // Closing/replacing the modal invalidates pending OTP responses.
      if (current !== flow) return;
      if (endpoint === 'request') {
        if(data.delivery_channel!=='sms')throw Error('SMS-провайдер не подтвердил отправку. Используйте Telegram.');
        flow.resendAt=Date.now()+(Number(data.retry_after_seconds)||60)*1000;
        flow.stage = 'code';
        flow.channel = data.delivery_channel || payload.channel;
        const length = Number(data.code_length);
        flow.codeLength = length >= 4 ? Math.min(8, Math.floor(length)) : 6;
        render();
      } else if (data.registration_required) {
        if (!data.signup_token) throw new Error('Не удалось начать регистрацию. Запросите код снова.');
        flow.signupToken = data.signup_token;
        flow.stage = 'name';
        render();
      } else {
        const token = data.token || data.access_token;
        if (!token || !data.user) throw new Error('Сервер не вернул сессию покупателя.');
        closeModal();
        await onSession({...data, token}, flow.after);
      }
    } catch (error) {
      if (current === flow) { errorElement.textContent = authErrorText(error.message,language()); errorElement.hidden = false; }
    } finally {
      flow.busy = false;
      if (current === flow) {getForm()?.querySelectorAll('button,input').forEach(element => element.disabled = false);const resend=document.querySelector('[data-auth-resend]');if(resend)resend.disabled=flow.resendAt>Date.now();}
    }
  }
  return {
    open(after, {resume=false}={}) {
      openModal('', '', false, {preserveAuth:resume});
      current = {stage: 'telegram', phone: '', codeLength: 6, channel: 'sms', signupToken: '', busy: false, after};
      render();
    },
    cancel() { stopCountdown();current = null;telegram.cancel().catch(()=>{}); },
    async resume(){if(!telegram.pending())return;this.open(undefined,{resume:true});const flow=current;try{const data=await telegram.waitForCompletion({isActive:()=>current===flow&&flow.stage==='telegram'});if(data&&current===flow){closeModal();await onSession(data,flow.after);}}catch(error){if(current===flow){const el=document.querySelector('#authError');el.textContent=authErrorText(error.message,language());el.hidden=false;}}},
    submit,
    changePhone() { telegram.cancel().catch(()=>{});if (current && !current.busy) { current.stage = 'phone'; current.signupToken = ''; render(); } },
    resend() { if(current?.resendAt>Date.now())return;return submit(getForm(), 'sms'); },
  };
}
