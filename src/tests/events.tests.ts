import auth from "./auth";
import fetch from "node-fetch";

export default () => {
        
    const urlApiLocal = '/v1/events/list';

    let nextSyncToken:string = null;
    let nextPageToken:string = null;

    const objectExpect = expect.objectContaining({
        kind: expect.any(String),
        eatg: expect.any(String),
        id: expect.any(String),
        status: expect.any(String),
        htmlLink: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        summary: expect.any(String),
        creator: {
            email: expect.any(String),
            self: expect.any(Boolean)
        },
        organizer: {
            email: expect.any(String),
            self: expect.any(Boolean)
        },
        start: {
            dateTime: expect.any(String),
            timeZone: expect.any(String)
        },
        end: {
            dateTime: expect.any(String),
            timeZone: expect.any(String)
        },
        icaluid: expect.any(String),
        //sequence: 0, // "??Pendiente???",
        attendees: expect.any(Array),
    /* reminders: {
            useDefault: false, // "??Pendiente???",
            // ON: item.IsReminderOn,
            // MINUTESBEFORE: item.ReminderMinutesBeforeStart
        }*/
    });

    it("List events: Bad request 1", ( done ) => {
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

    it("List events: Bad request 2", ( done ) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };
        
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999, headers })
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

    it("List events: success", ( done ) => {
        let now = new Date();
        let now1 = new Date();

        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {
            maxResults: 2,
            timeMin: new Date( now.setMonth( now.getMonth() - 6)  ),
            timeMax: new Date( now1.setMonth( now.getMonth() + 12)  )
        };
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999, headers, body:JSON.stringify( parms ) })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {            
            expect(json.events).not.toBeNull();
            expect(json.events).not.toBeUndefined();

            expect(json.events.items).not.toBeNull();
            expect(json.events.items).not.toBeUndefined();

            const mock = jest.fn();

            json.events.items.map( (x:any) => mock(x) ); 

            expect(mock).toBeCalledWith(objectExpect);

            expect(json.events.nextSyncToken).not.toBeNull();
            expect(json.events.nextSyncToken).not.toBeUndefined();

            nextSyncToken = json.events.nextSyncToken;

            if( json.events.nextPageToken )
                nextPageToken = json.events.nextPageToken;
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    
    it("List events: nextSyncToken", ( done ) => {
        let now = new Date();
        let now1 = new Date();

        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {
            maxResults: 2,
            timeMin: new Date( now.setMonth( now.getMonth() - 6)  ),
            timeMax: new Date( now1.setMonth( now.getMonth() + 12)  ),
            nextSyncToken
        };
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999, headers, body:JSON.stringify( parms ) })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {
            
            expect(json.events).not.toBeNull();
            expect(json.events).not.toBeUndefined();

            expect(json.events.items).toEqual([]);

            expect(json.events.nextSyncToken).not.toBeNull();
            expect(json.events.nextSyncToken).not.toBeUndefined();
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });


    it("List events: nextPageToken", ( done ) => {
        if( !nextPageToken )
            return done();

        let now = new Date();
        let now1 = new Date();

        let headers = {
            "Content-Type": "application/json",
            "Authorization": auth.access_token
        };

        let parms = {
            maxResults: 2,
            timeMin: new Date( now.setMonth( now.getMonth() - 6)  ),
            timeMax: new Date( now1.setMonth( now.getMonth() + 12)  ),
            nextPageToken
        };
          
        fetch(auth.urlBase + urlApiLocal, { method:"POST", timeout:999999999, headers, body:JSON.stringify( parms ) })
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {            
            expect(json.events).not.toBeNull();
            expect(json.events).not.toBeUndefined();

            expect(json.events.items).not.toBeNull();
            expect(json.events.items).not.toBeUndefined();

            const mock = jest.fn();

            json.events.items.map( (x:any) => mock(x) ); 

            expect(mock).toBeCalledWith(objectExpect);

            expect(json.events.nextSyncToken).not.toBeNull();
            expect(json.events.nextSyncToken).not.toBeUndefined();
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
}

