import yargs from "yargs";
import watchman from "fb-watchman";

export const argv = yargs
    .usage("sync 2 folders in bi-direction")
    .option("include", {
        alias: "-i",
        type: "array",
        describe: "include only issues with description",
    })
    .option("exclude", {
        alias: "-e",
        type: "array",
        describe: "exclude issues with description",
    }).argv;

const client = new watchman.Client();

client.capabilityCheck(
    { optional: [], required: ["relative_root"] },
    (error, resp) => {
        if (error) {
            console.error(error);
        }
        console.log(resp);
    }
);
