import React from 'react'
import { ScheduleMeeting } from 'react-schedule-meeting'

export function ReactSchedule() {
    // this generates basic available timeslots for the next 6 days
    const availableTimeslots = [0, 1, 2, 3, 4, 5].map(id => {
        return {
            id,
            startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
            endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(17, 0, 0, 0)),
        }
    })

    const handleTimeslotClicked = startTimeEventEmit => {
        startTimeEventEmit.resetDate()
        startTimeEventEmit.resetSelectedTimeState()
        console.log('startTimeEventEmit.startTime:',startTimeEventEmit.startTime)
    }

    return (
        <ScheduleMeeting
            borderRadius={10}
            primaryColor='#3f5b85'
            eventDurationInMinutes={30}
            availableTimeslots={availableTimeslots}
            onStartTimeSelect={handleTimeslotClicked}
            startTimeListStyle={'scroll-list'}
        />
    )
}
