import { isLangThai } from "./translations/translate";

export function gameToNameMap(key: string) {
    return {
        "candli_editor/incredible_machine0": isLangThai() ?
            "กลไกมหัศจรรย์ - บทช่วยสอน" :
            "Incredible Machines - Tutorial"
        ,
        "candli_editor/incredible_machine1": isLangThai() ?
            "กลไกมหัศจรรย์ - ระดับ 1" :
            "Incredible Machines - Level 1"
        ,
        "candli_editor/incredible_machine2": isLangThai() ?
            "กลไกมหัศจรรย์ - ระดับ 2" :
            "Incredible Machines - Level 2"
        ,
    }[key];
}