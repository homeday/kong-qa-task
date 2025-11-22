const { expect } = require('chai');
const { api, items_sub_path, basic_auth } = require('./kong');

let createdItemIds = [];

describe('API gateway Performance Tests', function() {
    this.timeout(60000);

    it('should handle 10 concurrent get requests within 5 seconds', async function() {
        const concurrentRequests = 10;
        const promises = [];
        const startTime = Date.now();

        for (let i = 0; i < concurrentRequests; i++) {
            const promise = api
                .get(items_sub_path)
                .set('Authorization', basic_auth)
                .expect(200).catch(err => {
                    console.error("Getting failed:", id, err.message);
                    throw err;
                })
            promises.push(promise);
        }
        await Promise.all(promises);
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        console.log(`10 concurrent requests completed in ${totalTime}ms`);
        expect(totalTime).to.be.lessThan(5000);
    });

    it('should handle 10 concurrent post requests within 5 seconds', async function() {
        const iterations = 10; 
        let promises = []
        const startTime = Date.now();
        for (let i = 0; i < iterations; i++) {
            const item = {
                name: `Perf Test Item ${i}`,
                data: { price: i * 10, iteration: i}
            };
            const promise = api
                .post(items_sub_path)
                .set('Authorization', basic_auth)
                .send(item)
                .expect(200).catch(err => {
                    console.error("Adding failed:", err.message);
                    throw err;
                })
            promises.push(promise);
        }
        const results = await Promise.allSettled(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log(`10 concurrent requests completed in ${totalTime}ms`);

        for(const result of results) {
            if (result.status === "fulfilled") {
                createdItemIds.push(result.value.body.id);
            } else {
                console.error("Request failed:", result.reason.message);
            }
        }
        expect(totalTime).to.be.lessThan(5000);
    });

    it('should handle 10 concurrent delete requests within 5 seconds', async function() {
        let promises = []
        const startTime = Date.now();
        for(const created_id of createdItemIds) {
            const promise = api
                .delete(`${items_sub_path}/${created_id}`)
                .set('Authorization', basic_auth)
                .expect(200).catch(err => {
                    console.error("Removal failed:", id, err.message);
                    throw err;
                })
            promises.push(promise);
        }
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log(`20 concurrent requests completed in ${totalTime}ms`);
        await Promise.allSettled(promises);
        expect(totalTime).to.be.lessThan(5000);
    });
});