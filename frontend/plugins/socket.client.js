import io from 'socket.io-client';
import { useRuntimeConfig } from '#app';

export default ({ app }, inject) => {
  const config = useRuntimeConfig();
  const socket = io(config.public.apiURL);

  inject('socket', socket);
};
