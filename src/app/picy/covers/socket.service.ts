import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private subject: Subject<MessageEvent>;

    constructor() { }

    public connect(url): Subject<MessageEvent>
    {
        if(!this.subject)
        {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }
        return this.subject;
    }

    private create(url): Subject<MessageEvent>
    {
        let ws = new WebSocket(url);

        let observable = Observable.create((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            ws.onopen = () => {
                if(ws.readyState === WebSocket.OPEN)
                    ws.send("AUTH:CLIENT");
                else
                    console.log("Not open on open");
            };

            return ws.close.bind(ws);
        });
        let observer = {
            next: (data: string) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            }
        };
        return Subject.create(observer, observable);
    }
}
