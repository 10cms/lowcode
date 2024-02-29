import supertest, * as request from 'supertest';
import { UserDocument } from 'src/user/schemas/user.schema';
import { TestingApp } from '.';
import { UserService } from 'src/user/services/user/user.service';

export type Net = {
  get: (url: string, user?: UserDocument) => supertest.Test;
  post: (url: string, user?: UserDocument) => supertest.Test;
  patch: (url: string, user?: UserDocument) => supertest.Test;
  put: (url: string, user?: UserDocument) => supertest.Test;
  delete: (url: string, user?: UserDocument) => supertest.Test;
}

export const injectNet = (app: TestingApp) => {
  const net = {} as Net;
  ['get', 'post', 'patch', 'put', 'delete'].forEach(method => {
    net[method] = (url: string, user?: UserDocument) => {
      const server = app.getHttpServer()
      const req = request(server)[method](url)

      if (user) {
        const accessToken = app.get(UserService).createAccessToken(user)
        req.auth(accessToken, { type: 'bearer' })
      }

      return req
    }
  })

  app.net = net
}