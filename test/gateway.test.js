const { expect } = require('chai');
const { api, items_sub_path, basic_auth } = require('./kong');


describe('API gateway items', () => {
    it('testing headers', async () => {
        const res = await api.get(items_sub_path).set('Authorization', basic_auth).expect(200);
        expect(res.headers['x-kong-request-id']).to.exist;
    });

    it('should return 404 when invalid subpath', async () => {
        await api.get("/invalid").set('Authorization', basic_auth).expect(404);
    });
})