const Reservation = require('../model/reservationmodel');
const user = require('../model/usermodel');
const Restuarant = require('../model/restaurantmodel')

const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

//function to check whether booking time is between opening and closing time of restaurant
const isWithinBusinessHours = (requestedTime, openingTime, closingTime) => {
    const requestedMinutes = convertTimeToMinutes(requestedTime);
    const openingMinutes = convertTimeToMinutes(openingTime);
    const closingMinutes = convertTimeToMinutes(closingTime);
    return requestedMinutes >= openingMinutes && requestedMinutes <= closingMinutes;
};

//function to check whether booking is done atleast 15 mins in advance
const isValidBookingTime = (bookingDate, bookingTime) => {
    const now = new Date();
    const bookingDateTime = new Date(bookingDate);
    const [hours, minutes] = bookingTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    
    const diffInMinutes = (bookingDateTime - now) / (1000 * 60);
    return diffInMinutes >= 15;
};

const checkAvailability = async (restaurantId, date, time) => {
    try {
        // Get restaurant details
        const restaurant = await Restuarant.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Check if booking time is at least 15 mins in the future
        if (!isValidBookingTime(date, time)) {
            throw new Error('Reservations must be made at least 15 minutes in advance');
        }

        // Check if requested time is within business hours
        if (!isWithinBusinessHours(time, restaurant.openingTime, restaurant.closingTime)) {
            throw new Error('Selected time is outside business hours');
        }

        // Get all reservations for the requested date
        const requestedDate = new Date(date);
        const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

        const reservations = await Reservation.find({
            restaurantId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'confirmed'
        });

        // Calculate occupied tables for each time slot
        const timeSlots = {};
        const requestedMinutes = convertTimeToMinutes(time);

        // Check overlapping reservations (considering 60 min duration)
        const occupiedTables = {
            twoPerson: 0,
            fourPerson: 0,
            sixPerson: 0
        };
        reservations.forEach(reservation => {
            const reservationMinutes = convertTimeToMinutes(reservation.time);
            if (Math.abs(reservationMinutes - requestedMinutes) < 60) {
                occupiedTables.twoPerson += reservation.tables.twoPerson;
                occupiedTables.fourPerson += reservation.tables.fourPerson;
                occupiedTables.sixPerson += reservation.tables.sixPerson;
            }
        });

        // Calculate available tables
        const availability = {
            twoPerson: Math.max(0, restaurant.capacity.twoPerson - occupiedTables.twoPerson),
            fourPerson: Math.max(0, restaurant.capacity.fourPerson - occupiedTables.fourPerson),
            sixPerson: Math.max(0, restaurant.capacity.sixPerson - occupiedTables.sixPerson)
        };
        
        // Find next available time
        let nextAvailable = {};
        if (Object.values(availability).some(v => v === 0)) {
            let nextTime = requestedMinutes + 60;
            while (nextTime <= convertTimeToMinutes(restaurant.closingTime)) {
                const checkTime = convertMinutesToTime(nextTime);
                const isSlotAvailable = !reservations.some(reservation => {
                    const reservationMinutes = convertTimeToMinutes(reservation.time);
                    return Math.abs(reservationMinutes - nextTime) < 60;
                });

                if (isSlotAvailable) {
                    nextAvailable = {
                        time: checkTime,
                        tables: {
                            twoPerson: restaurant.capacity.twoPerson,
                            fourPerson: restaurant.capacity.fourPerson,
                            sixPerson: restaurant.capacity.sixPerson
                        }
                    };
                    break;
                }
                nextTime += 60;
            }
        }

        return {
            currentAvailability: availability,
            nextAvailable: nextAvailable
        };
    } catch (error) {
        throw error;
    }
};

// Function to create reservation
const createReservation = async (req,res) => {
    try {
        const {restaurantId,date,time,tables} = req.body;
        const userId = req.user._id;
        
        // Check if booking time is at least 15 mins in the future
        if (!isValidBookingTime(date, time)) {
            return res.status(400).json({ message: "Reservations must be made at least 15 minutes in advance" });
        }

        
        const availabilityCheck = await checkAvailability(restaurantId, date, time);
        
        // Verify if requested tables are available
        if (tables.twoPerson > availabilityCheck.currentAvailability.twoPerson ||
            tables.fourPerson > availabilityCheck.currentAvailability.fourPerson ||
            tables.sixPerson > availabilityCheck.currentAvailability.sixPerson) {
            return res.status(400).json({message:"Requested tables are not available"})
        }

        // Create new reservation
        const reservation = new Reservation({
            restaurantId,
            userId,
            date,
            time,
            tables,
            status: 'confirmed'
        });

        await reservation.save();
         res.status(200).json(reservation);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
};

const checkAvailaity_Controller = async(req,res)=>{
    try {
        const {restaurantId, date, time} = req.body;
        const availability = await checkAvailability(restaurantId,date,time);
        res.status(200).json({availability});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}


const updateReservation = async (req,res) => {
    try {
        const {updates} = req.body;
        const reservationId = req.params.reservationId;
        const userId = req.user._id;
        const existingReservation = await Reservation.findOne({_id:reservationId});

        if(!existingReservation)
        {
            return res.status(400).json({message:"No Reservation Found"});
        }

        if(existingReservation.userId.toString() !== userId.toString())
        {
            return res.status(401).json({message:"Unauthorized access to reservation"})
        }

        // If updating time, check if new time is at least 15 mins in the future
        if (updates.time || updates.date) {
            const checkDate = updates.date || existingReservation.date;
            const checkTime = updates.time || existingReservation.time;
            
            if (!isValidBookingTime(checkDate, checkTime)) {
                return res.status(400).json({message: "Updated reservation time must be at least 15 minutes in advance"});
            }
        }

        // If date or time or tables are being updated, check availability
        if (updates.date || updates.time || updates.tables) {
            const restaurant = await Restuarant.findById(existingReservation.restaurantId);
            
            // Check if new time is within business hours
            const checkTime = updates.time || existingReservation.time;
            if (!isWithinBusinessHours(checkTime, restaurant.openingTime, restaurant.closingTime)) {
                return res.status(400).json({message:"Updated time is outside business hours"});
            }

            // Check availability excluding current reservation
            const checkDate = updates.date || existingReservation.date;
            const startOfDay = new Date(checkDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(checkDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Get all other reservations for the same day
            const overlappingReservations = await Reservation.find({
                restaurantId: existingReservation.restaurantId,
                _id: { $ne: reservationId }, 
                date: { $gte: startOfDay, $lte: endOfDay },
                status: 'confirmed'
            });

            const requestedMinutes = convertTimeToMinutes(checkTime);
            const occupiedTables = {
                twoPerson: 0,
                fourPerson: 0,
                sixPerson: 0
            };

            overlappingReservations.forEach(reservation => {
                const reservationMinutes = convertTimeToMinutes(reservation.time);
                if (Math.abs(reservationMinutes - requestedMinutes) < 60) {
                    occupiedTables.twoPerson += reservation.tables.twoPerson;
                    occupiedTables.fourPerson += reservation.tables.fourPerson;
                    occupiedTables.sixPerson += reservation.tables.sixPerson;
                }
            });

            // Check if requested tables are available
            const requestedTables = updates.tables || existingReservation.tables;
            if (
                requestedTables.twoPerson > (restaurant.capacity.twoPerson - occupiedTables.twoPerson) ||
                requestedTables.fourPerson > (restaurant.capacity.fourPerson - occupiedTables.fourPerson) ||
                requestedTables.sixPerson > (restaurant.capacity.sixPerson - occupiedTables.sixPerson)
            ) {
                return res.status(400).json({message:"Requested tables are not available for the updated time"});
            }
        }

        // If all validations pass, update the reservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {
                ...(updates.date && { date: updates.date }),
                ...(updates.time && { time: updates.time }),
                ...(updates.tables && { tables: updates.tables })
            },
            { new: true }
        );

        res.status(200).json({updatedReservation});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
};

const deleteReservation = async (req,res ) => {
    try {
        
        const reservationId = req.params.reservationId;
        const userId = req.user._id;
        const reservation = await Reservation.findOne({_id:reservationId});

        if(!reservation)
        {
            return res.status(400).json({message:"No Reservation Found"});
        }

        if(reservation.userId.toString() !== userId.toString())
        {
            return res.status(401).json({message:"Unauthorized access to reservation"})
        }

        // Check if reservation is in the future
        const reservationDateTime = new Date(reservation.date);
        reservationDateTime.setHours(
            ...reservation.time.split(':').map(Number)
        );

        if (reservationDateTime < new Date()) {
            return res.status(401).json({message:"Cannot delete past reservations"});
        }

        // Soft delete by updating status to cancelled
        const cancelledReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { status: 'cancelled' },
            { new: true }
        );

        res.status(200).json({cancelledReservation});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
};

module.exports = {checkAvailaity_Controller,createReservation,updateReservation,deleteReservation}
