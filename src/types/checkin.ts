
import { EventType, CheckinStatusType } from './enum'; 
import { User } from './user'; 

export interface Checkin {
  id: number; // SERIAL PRIMARY KEY 
  user_student_id: string; // VARCHAR(10) NOT NULL - Foreign Key
  user_citizen_id: string; // VARCHAR(13) NOT NULL - Foreign Key
  event: EventType; // event_type NOT NULL
  status: CheckinStatusType; // checkin_status_type NOT NULL
  created_at: Date; // TIMESTAMP DEFAULT now() NOT NULL
  updated_at: Date; // TIMESTAMP DEFAULT now() NOT NULL

}
