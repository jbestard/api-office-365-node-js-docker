import auth from "./auth";
import fetch from "node-fetch";

export default () => {
        
    const urlApiLocal = '/v1/events/channel/stop';

    it("Remove Events Notifications Channel: Bad request", ( done ) => {
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999 })
        .then((res:any) => {
            expect(res.status).toBe(400);
            return res.json()
        })
        .then((json: any) => {
            const mock = jest.fn();
            mock(json);
            expect(mock).toBeCalledWith(expect.objectContaining({ 
                error: expect.any(String)
            }));
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Remove Events Notifications Channel: success", ( done ) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {};
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999, headers, body:JSON.stringify( parms ) })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
};