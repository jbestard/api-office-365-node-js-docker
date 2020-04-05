import log from "../services/logger";
import Event from "./entities/event.entities";
import Subcription from "./entities/subcription.entities";
import User from "./entities/user.entities";

import Database from "../database/config";
const conn = Database.getInstance();

const getUserByOid = ( oid: string ) => {
    log.info("invoke - getUserByOid", oid);
    return new Promise((resolve, reject) => {
        let userRepository = conn.db.getRepository(User);
        userRepository.findOne({oid}).then( (data: any) => {
            resolve(data);
        } ).catch( (err) => {
            log.error("ERROR: getUserByOid", oid, err);
            reject(false);
        } );
    });
};

const saveUser = async ( user: User ) => {
    log.info("invoke - saveUser", user.email);
    try {
        let userRepository = conn.db.getRepository(User);
        await userRepository.save(user);
        log.info("User has been saved");
    } catch (err) {
        log.error("ERROR:User has been saved", err);
    }
};

const getEventById = ( eventId: string, oid: string ) => {
    log.info("invoke - getEventById", eventId);
    return new Promise((resolve, reject) => {
        let eventRepository = conn.db.getRepository(Event);

        eventRepository
        .findOne({ relations: ["user"], where: { eventId, _user: { oid }} } )
        .then( (data: any) => {
            resolve(data);
        } ).catch( (err: any) => {
            log.error("ERROR: getEventById", eventId, err);
            reject(false);
        } );
    });
};

const getEventByUser = ( oid: string ) => {
    log.info("invoke - getEventByUser", oid);
    return new Promise((resolve, reject) => {
        let eventRepository = conn.db.getRepository(Event);

        eventRepository
        .find({ relations: ["user"], where: { _user: { oid }} } )
        .then( (data: any) => {
            resolve(data);
        } ).catch( (err: any) => {
            log.error("ERROR: getEventByUser", oid, err);
            reject(false);
        } );
    });
};

const insertEvent = async ( event: Event ) => {
    log.info("invoke - insertEvent");
    try {
        let eventRepository = conn.db.getRepository(Event);
        await eventRepository.save(event);
        log.info("Event has been saved");
    } catch (err) {
        log.error("ERROR:Event has been saved", err);
    }
};

const getSubcriptionById = ( SubId: string, oid: string ) => {
    log.info("invoke - getSubcriptionById", SubId);
    return new Promise((resolve, reject) => {
        let subcriptionRepository = conn.db.getRepository(Subcription);

        subcriptionRepository
        .findOne({ relations: ["user"], where: { SubId, _user: { oid }} } )
        .then( (data: any) => {
            resolve(data);
        } ).catch( (err: any) => {
            log.error("ERROR: getSubcriptionById", SubId, err);
            reject(false);
        } );
    });
};

const getSubcriptionByUser = ( oid: string ) => {
    log.info("invoke - getSubcriptionByUser", oid);
    return new Promise((resolve, reject) => {
        let subcriptionRepository = conn.db.getRepository(Subcription);

        subcriptionRepository
        .find({ relations: ["user"], where: { _user: { oid }} } )
        .then( (data: any) => {
            resolve(data);
        } ).catch( (err: any) => {
            log.error("ERROR: getSubcriptionById", oid, err);
            reject(false);
        } );
    });
};

const saveSubcription = async ( subcription: Subcription ) => {
    log.info("invoke - saveSubcription");
    try {
        let subcriptionRepository = conn.db.getRepository(Subcription);
        await subcriptionRepository.save(subcription);
        log.info("Subcription has been saved");
    } catch (err) {
        log.error("ERROR:Subcription has been saved", err);
    }
};

const deleteSubcription = async ( subcription: Subcription ) => {
    try {
        let subcriptionRepository = conn.db.getRepository(Subcription);
        await subcriptionRepository.remove(subcription);
        log.info("Subcription has been delete");
    } catch (err) {
        log.error("ERROR:Subcription has been delete", err);
    }
};

const deleteEvent = async ( event: Event ) => {
    try {
        let eventRepository = conn.db.getRepository(Event);
        await eventRepository.remove(event);
        log.info("Event has been delete");
    } catch (err) {
        log.error("ERROR:Event has been delete", err);
    }
};

const deleteUser = async ( user: User ) => {
    try {
        let userRepository = conn.db.getRepository(User);
        await userRepository.remove(user);
        log.info("User has been delete");
    } catch (err) {
        log.error("ERROR:User has been delete", err);
    }
};

export default {
    saveUser,
    getUserByOid,
    insertEvent,
    getEventById,
    saveSubcription,
    getSubcriptionById,
    getSubcriptionByUser,
    deleteSubcription,
    deleteEvent,
    deleteUser,
    getEventByUser
};
