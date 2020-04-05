import auth from "./auth";
import fetch from "node-fetch";

export default () => {
        
    const urlApiLocal = '/v1/events/channel/new';

    const objectExpect = expect.objectContaining({
        kind: expect.any(String),
        id: expect.any(String),
        resourceId: expect.any(String),
        resourceUrl: expect.any(String),
        expiration: expect.any(Number),
    });

    it("Notification URL: success", ( done ) => {
        fetch(auth.urlBase + '/notification?validationtoken=tokenexample', { method:"POST" })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.text()
        })
        .then((text: any) => {
            expect(text).toEqual("tokenexample");
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Create Events Notifications Channel: Bad request", ( done ) => {
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

    it("Create Events Notifications Channel: expirationHours default success", ( done ) => {
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
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Create Events Notifications Channel: expirationHours 48H success", ( done ) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {
            expirationHours:48
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
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
};