import auth from "./auth";
import fetch from "node-fetch";

export default () => {
    const urlApiLocal = '/v1/token';

    it("Get user’s OAuth token from authorization code: CODE not found", ( done ) => {
        fetch(auth.urlBase + urlApiLocal)
        .then((res:any) => {
            expect(res.status).toBe(400);
            return res.json()
        })
        .then((json: any) => {
            expect(json).toEqual({
                error: "FIELD 'CODE' IS REQUIRED ON QUERYSTRING"
            });
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Get user’s OAuth token from authorization code: CODE invalid", ( done ) => {
        let url = new URL(auth.urlBase + urlApiLocal);
        url.searchParams.append("code","codeInvalid");

        fetch( url )
        .then((res:any) => {
            expect(res.status).toBe(400);
            return res.json()
        })
        .then((json: any) => {
            expect(json).toEqual({
                error: "INVALID_GRANT (BAD REQUEST)"
            });
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Get user’s OAuth token from authorization code: success", ( done ) => {
        let url = new URL(auth.urlBase + urlApiLocal);
        url.searchParams.append("code", auth.code);

        fetch( url )
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {
            expect(json.token).not.toBeNull();
            expect(json.token).not.toBeUndefined();

            const mock = jest.fn();
            mock(json.token);
            expect(mock).toBeCalledWith(expect.objectContaining({ 
                access_token: expect.any(String),
                expires_in: expect.any(Number),
                refresh_token: expect.any(String),
                scope: expect.any(String),
                token_type: expect.any(String),
            }));

            auth.access_token = json.token.access_token;
            auth.refresh_token = json.token.refresh_token;
            
            expect(auth.valideToken(auth.access_token)).not.toBeNull();
            expect(auth.valideToken(auth.refresh_token)).not.toBeNull();
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
}

