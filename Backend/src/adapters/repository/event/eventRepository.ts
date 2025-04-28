import { ObjectId } from "mongoose";
import { EventEntity } from "../../../domain/entities/event/eventEntity";
import { EventUpdateEntity } from "../../../domain/entities/event/eventUpdateEntity";
import { IeventRepository } from "../../../domain/interfaces/repositoryInterfaces/event/eventRepositoryInterface";
import { eventModel } from "../../../framework/database/models/eventModel";
export class EventRepository implements IeventRepository {
    async createEvent(event: EventEntity): Promise<EventEntity> {
        return await eventModel.create(event)
    }
    async findAllEventsClient(pageNo: number): Promise<{ events: EventEntity[] | [], totalPages: number }> {
        const limit = 2
        const page = Math.max(pageNo, 1)
        const skip = (page - 1) * limit
        const events = await eventModel.find().select('-__v').skip(skip).limit(limit)
        const totalPages = Math.ceil(await eventModel.countDocuments() / limit)
        return { events, totalPages }
    }
    async findEventsOfAVendor(vendorId: string, pageNo: number): Promise<{ events: EventEntity[] | [], totalPages: number }> {
        const limit = 5
        const page = Math.max(pageNo, 1)
        const skip = (page - 1) * limit
        const events = await eventModel.find({ hostedBy: vendorId }).select('-__v').skip(skip).limit(limit)
        const totalPages = Math.ceil(await eventModel.countDocuments({ hostedBy: vendorId }) / limit)
        return { events, totalPages }
    }
    async editEvent(eventId: string, update: EventUpdateEntity): Promise<EventEntity | null> {
        return await eventModel.findByIdAndUpdate(eventId, update, { new: true }).select('-__v')

    }
    async findEventById(eventId: string): Promise<EventEntity | null> {
        return eventModel.findById(eventId).select('-__v')
    }
    async updateTicketPurchaseCount(eventId: string | ObjectId, newCount: number): Promise<EventEntity | null> {
        return eventModel.findByIdAndUpdate(eventId, { ticketPurchased: newCount })
    }
    async findTotalTicketCountAndticketPurchased(eventId: string | ObjectId): Promise<{ totalTicket: number; ticketPurchased: number; }> {
        const eventDetails = await eventModel.findById(eventId).select('ticketPurchased totalTicket')
        if (!eventDetails) throw new Error('No event found in this ID')
        return { totalTicket: eventDetails?.totalTicket, ticketPurchased: eventDetails?.ticketPurchased }
    }
    async findEventByIdForTicketVerification(eventId: string): Promise<EventEntity | null> {
        return eventModel.findById(eventId).select('hostedBy')
    }
    async findTotalTicketAndBookedTicket(eventId: string): Promise<EventEntity | null> {
        return eventModel.findById(eventId).select('totalTicket ticketPurchased')
    }

}