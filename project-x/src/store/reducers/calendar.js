/* global localStorage */
import Device from '../../device';

const initialState = {
  allCalendars: [],
  currentCalendar: localStorage.getItem('calendarId') || '',
  currentCalendarEvents: JSON.parse(localStorage.getItem('Events')) || [],

  access_token: '',
  loading: false,
  room: {
    status: 'Available',
    timeStart: '',
    eventName: '',
    description: '',
    timeEnd: '',
    BtnName: 'Quick book for now!',
    timeToNextEvent: ' - ',
  },
};

export default function calendar(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_CALENDAR':
    {
      localStorage.setItem('calendarId', action.payload);
      return {
        ...state,
        currentCalendar: action.payload,
      };
    }
    case 'SAVE_CALENDAR':
    {
      const calendars = [...state.allCalendars];
      calendars.push(action.payload);
      return {
        ...state,
        allCalendars: [...calendars],
      };
    }
    case 'CREATE_CALENDARS_LIST':
    {
      return {
        ...state,
        allCalendars: [...action.payload],
        loading: false,
      };
    }
    case 'REFRESH_TOKEN':
    {
      localStorage.setItem('accessToken', action.payload);
      localStorage.setItem('expires_in', action.TTL);
      return {
        ...state,
        access_token: action.payload,
      };
    }
    case 'SET_AVAILABLE_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SET_RESERVED_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SET_BUSY_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SHOW_SPINNER':
    {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case 'LOAD_CALENDAR_EVENTS':
    {
      localStorage.setItem('Events', JSON.stringify(action.payload));
      return {
        ...state,
        currentCalendarEvents: [...action.payload],
      };
    }
    case 'SAVE_EVENT':
    {
      const events = [...state.currentCalendarEvents];
      const eventDate = Date.parse(action.payload.end);
      const index = events.findIndex(e => eventDate < Date.parse(e.end));

      if (index !== -1) {
        events.splice(index, 0, { ...action.payload });
      } else {
        events.push({ ...action.payload });
      }
      Device.showToast('Event added!');
      return {
        ...state,
        currentCalendarEvents: events,
      };
    }
    case 'DELETE_EVENT':
    {
      const events = [...state.currentCalendarEvents];
      const index = events.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        events.splice(index, 1);
      }
      return {
        ...state,
        currentCalendarEvents: events,
      };
    }
    case 'ERROR_HANDLER':
    {
      navigator.notification.alert(action.payload, null, 'Room Manager', 'OK');
      return state;
    }
    default:
      return state;
  }
}
