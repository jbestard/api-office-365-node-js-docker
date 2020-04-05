import auth from "./auth";
import fetch from "node-fetch";

export default () => {
    const urlApiLocal = "/v1/token/refresh";

    it("Refresh user’s OAuth token from refresh token: refresh_token not found", ( done ) => {
        fetch(auth.urlBase + urlApiLocal)
        .then((res:any) => {
            expect(res.status).toBe(400);
            return res.json()
        })
        .then((json: any) => {
            expect(json).toEqual({
                error: "FIELD 'refresh_token' IS REQUIRED ON QUERYSTRING"
            });
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });

    it("Refresh user’s OAuth token from refresh token: refresh_token invalid", ( done ) => {
        let url = new URL(auth.urlBase + urlApiLocal);
        url.searchParams.append("refresh_token","refresh_tokenInvalid");

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

    it("Refresh user’s OAuth token from refresh token: success", ( done ) => {
        let url = new URL(auth.urlBase + urlApiLocal);
        url.searchParams.append("refresh_token", auth.refresh_token);

        fetch( url )
        .then((res:any) => {
            expect(res.status).toBe(200);
            return res.json()
        })
        .then((json: any) => {
            const mock = jest.fn();
            mock(json.token);
            expect(mock).toBeCalledWith(expect.objectContaining({ 
                access_token: expect.any(String),
                expires_in: expect.any(Number),
                scope: expect.any(String),
                token_type: expect.any(String),
            }));

            auth.access_token = json.token.access_token;
            
            expect(auth.valideToken(auth.access_token)).not.toBeNull();
           
            done();
        })
        .catch((err: any) => {
            done(err);
        });
    });
}

