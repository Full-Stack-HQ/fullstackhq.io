
export function logEvent(category: string, action: string, label?: string): void {
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
  });
}