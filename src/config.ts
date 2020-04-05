export default{
    client_id: "126058dc-84be-4a94-b92c-b51733bc771b",
    redirect_uri: "http://localhost/",
    client_secret: "9YvdCUzJAzSRsS=z_ByBaFzY7cJ:e3-8",
    scope1: [
        "openid",
        "offline_access",
        "Calendars.Read",
        "Calendars.Read.Shared",
        "Calendars.ReadWrite"
    ],
    scope2: [
        "https://outlook.office.com/calendars.readwrite",
        "https://outlook.office.com/calendars.read"
    ],
    urls: {
        authorize: "https://login.windows.net/common/oauth2/v2.0/authorize",
        token: "https://login.windows.net/common/oauth2/v2.0/token",
    }
};
