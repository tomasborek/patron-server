import { Router } from 'express';

export default class StationRouterFactory {
  getRouter() {
    return Router().post('');
  }
}
