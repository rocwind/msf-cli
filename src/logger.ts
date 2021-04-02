export type Logger = (text: string) => void;
type WithColor = (text: string) => string;

export function getLogger(color: WithColor): Logger {
    return (text: string) => {
        console.log(color(text));
    };
}
