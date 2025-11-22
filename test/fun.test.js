const { expect } = require('chai');
const { api, items_sub_path, basic_auth, item, updated_item } = require('./kong');


describe('API gateway Functional Tests', () => {

    let created_id = 0;

    it('POST /items should return 200 and created item', async () => {
        const res = await api
            .post(items_sub_path)
            .set('Authorization', basic_auth)
            .send(item)
            .expect(200);

        expect(res.body).to.have.property('id');
        const { id, createdAt, ...actual } = res.body;
        expect(actual).to.deep.equal(item);
        created_id = id;
    });

    it('POST /items without auth should return 401', async () => {
        await api.post(items_sub_path).send(item).expect(401);
    });

    it('GET /items/:id should return 200 and the item', async () => {
        const res = await api
            .get(`${items_sub_path}/${created_id}`)
            .set('Authorization', basic_auth)
            .expect(200);

        const { id, ...actual } = res.body;
        expect(actual).to.deep.equal(item);
        expect(id).to.equal(created_id);
    });

    it('GET /items/:id should return 404 when not existing item', async () => {
        await api
            .get(`${items_sub_path}/12345678900987654321`)
            .set('Authorization', basic_auth)
            .expect(404);
    });

    it('GET /items?id should return 200 and the item', async () => {
        const res = await api
            .get(`${items_sub_path}?id=${created_id}`)
            .set('Authorization', basic_auth)
            .expect(200);

        expect(res.body).to.be.an('array').with.lengthOf(1);
        const { id, ...actual } = res.body[0];
        expect(actual).to.deep.equal(item);
        expect(id).to.equal(created_id);
    });

    it('GET /items/:id without auth should return 401', async () => {
        await api.get(`${items_sub_path}/${created_id}`).expect(401);
    });

    it('PUT /items/:id should update and return 200', async () => {
        const res = await api
            .put(`${items_sub_path}/${created_id}`)
            .set('Authorization', basic_auth)
            .send(updated_item)
            .expect(200);

        const { id, updatedAt, ...actual } = res.body;
        expect(actual).to.deep.equal(updated_item);
        expect(id).to.equal(created_id);
    });

    it('PUT /items/:id without auth should return 401', async () => {
        await api.put(`${items_sub_path}/${created_id}`).send(updated_item).expect(401);
    });

    it('DELETE /items/:id without auth should return 401', async () => {
        await api.delete(`${items_sub_path}/${created_id}`).expect(401);
    });

    it('DELETE /items/:id should return 200', async () => {
        const res = await api
            .delete(`${items_sub_path}/${created_id}`)
            .set('Authorization', basic_auth)
            .expect(200);

        expect(res.body.message).to.equal(
            `Object with id = ${created_id} has been deleted.`
        );
    });

    it('GET /items/:id after delete should return 404', async () => {
        await api
            .get(`${items_sub_path}/${created_id}`)
            .set('Authorization', basic_auth)
            .expect(404);
    });

    it('POST /items within 2000ms', async () =>{
        const startTime = Date.now();
        
        const res = await api
            .post(items_sub_path)
            .set('Authorization', basic_auth)
            .send(item)
            .expect(200);

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        expect(responseTime).to.be.lessThan(2000);
        created_id = res.body.id;
    });

    it('GET /items within 2000ms', async () =>{
        const startTime = Date.now();
        await api
            .get(`${items_sub_path}?id=${created_id}`)
            .set('Authorization', basic_auth)
            .expect(200);

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        expect(responseTime).to.be.lessThan(2000);
    });
});
