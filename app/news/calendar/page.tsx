'use client';
import { useEffect, useState } from 'react';
import { getCalendarEvents, type CalendarEvent } from '@/lib/local-store';
import { getHoliday } from '@/lib/holidays';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getEventsForDay(events: CalendarEvent[], date: string) {
  return events.filter(e => e.startDate <= date && e.endDate >= date);
}

export default function CalendarPage() {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => { getCalendarEvents().then(setEvents); }, []);

  const year = cur.getFullYear();
  const month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build 6-week grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">일정</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCur(new Date(year, month - 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600">‹</button>
          <span className="text-base font-semibold text-gray-700 w-28 text-center">{year}년 {month + 1}월</span>
          <button onClick={() => setCur(new Date(year, month + 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600">›</button>
          <button onClick={() => setCur(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="ml-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50">오늘</button>
        </div>
      </div>

      {/* 달력 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAY_NAMES.map((d, i) => (
            <div key={d} className={`py-2 text-center text-xs font-semibold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'}`}>{d}</div>
          ))}
        </div>

        {/* 주 행 */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-0" style={{ minHeight: '100px' }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} className="border-r border-gray-100 last:border-0 bg-gray-50/50" />;
              const dateStr = fmt(year, month, day);
              const holiday = getHoliday(dateStr);
              const isToday = dateStr === fmt(today.getFullYear(), today.getMonth(), today.getDate());
              const dayEvents = getEventsForDay(events, dateStr);
              const isSun = di === 0;
              const isSat = di === 6;

              return (
                <div key={di} className="border-r border-gray-100 last:border-0 p-1 min-h-24">
                  {/* 날짜 숫자 */}
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                      ${isToday ? 'bg-gray-800 text-white' : isSun || holiday ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {holiday && <span className="text-xs text-red-500 truncate leading-none">{holiday}</span>}
                  </div>
                  {/* 이벤트 */}
                  <div className="space-y-0.5">
                    {dayEvents.map((ev) => {
                      const isStart = ev.startDate === dateStr;
                      const isEnd = ev.endDate === dateStr;
                      return (
                        <div key={ev.id}
                          style={{ backgroundColor: ev.color || '#3B82F6' }}
                          className={`text-white text-xs px-1.5 py-0.5 truncate leading-4
                            ${isStart && isEnd ? 'rounded' : isStart ? 'rounded-l' : isEnd ? 'rounded-r' : ''}`}>
                          {isStart ? ev.title : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
