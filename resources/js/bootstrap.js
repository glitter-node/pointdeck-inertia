import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.Pusher = Pusher;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: Number(import.meta.env.VITE_PUSHER_PORT || 443),
    wssPort: Number(import.meta.env.VITE_PUSHER_PORT || 443),
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: 'mt1',
    activityTimeout: 30000,
    pongTimeout: 15000,
    unavailableTimeout: 5000,
});
