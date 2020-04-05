import auth from "./auth";
import fetch from "node-fetch";

export default () => {
        
    const urlApiLocal = '/v1/channels/renew';

    const objectExpect = expect.objectContaining({
        stoppedChannels: expect.any(Number),
        startedChannels: expect.any(Number),
        errors:  expect.any(Array)
    });

    it("Renew All Events Notifications Channels: Bad request", ( done ) => {
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

    it("Renew All Events Notifications Channels: expirationHours default success", ( done ) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {};
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", headers, body:JSON.stringify( parms ), timeout:999999999 })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {           
            const mock = jest.fn();
            mock(json);

            expect(mock).toBeCalledWith(objectExpect);

            expect(json.stoppedChannels).toEqual(json.startedChannels);
            expect(json.errors).toEqual([]);
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Renew All Events Notifications Channels: expirationHours 48H success", ( done ) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {
            expirationHours:72
        };
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", headers, body:JSON.stringify( parms ), timeout:999999999 })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {           
            const mock = jest.fn();
            mock(json);

            expect(mock).toBeCalledWith(objectExpect);

            expect(json.stoppedChannels).toEqual(json.startedChannels);
            expect(json.errors).toEqual([]);
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
};