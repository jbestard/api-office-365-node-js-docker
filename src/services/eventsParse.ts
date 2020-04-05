import { Base64 } from "js-base64";

const getAttenders = ( attenders: any, emailOrg: string ) => {
    let attendersRes: any[] = attenders.map( ( att: any ) => {
        let isOrg = ( att.EmailAddress.Address === emailOrg );
        return {
                email: att.EmailAddress.Address,
                organizer: isOrg,
                self: false, // "??Pendiente???",
                responseStatus: att.Status.Response
        };
    });
    return attendersRes;
};

const eventsParse = ( result: any, maxResults: number, nextPageToken: number, nextSyncToken: string ) => {
    let lastSync = ( nextSyncToken ) ? new Date(parseInt(Base64.decode(nextSyncToken), 10)) : null;

    let events: any[] = result.value
        .filter( (it: any) => {
            if ( !lastSync ) { return true; } else {
                let update = new Date(it.LastModifiedDateTime);
                return update > lastSync;
            }
        })
        .map( (item: any) => {
            let event = {
                kind: "CALENDAR#EVENT",
                eatg: item["@odata.etag"],
                id: item.Id,
                status: item.ResponseStatus.Response,
                htmlLink: item.WebLink,
                created: item.CreatedDateTime,
                updated: item.LastModifiedDateTime,
                summary: item.Subject,
                creator: {
                    email: item.Organizer.EmailAddress.Address,
                    self: item.IsOrganizer
                },
                organizer: {
                    email: item.Organizer.EmailAddress.Address,
                    self: item.IsOrganizer
                },
                start: {
                    dateTime: item.Start.DateTime,
                    timeZone: item.Start.TimeZone
                },
                end: {
                    dateTime: item.End.DateTime,
                    timeZone: item.End.TimeZone
                },
                icaluid: item.iCalUId,
                sequence: 0, // "??Pendiente???",
                attendees: getAttenders( item.Attendees, item.Organizer.EmailAddress.Address ),
                reminders: {
                    useDefault: false, // "??Pendiente???",
                    // ON: item.IsReminderOn,
                    // MINUTESBEFORE: item.ReminderMinutesBeforeStart
                }
            };

            return event;
        });

    let sal: any = {
        items: events
    };

    sal.nextSyncToken = Base64.encode( String(new Date( ).getTime()) );

    if ( result["@odata.nextLink"] ) {
        sal.nextPageToken = ( nextPageToken ) ? nextPageToken + maxResults : maxResults;
    }

    return sal;
};

export default eventsParse;
