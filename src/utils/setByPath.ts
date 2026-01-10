// utils/setByPath.ts
export const setByPath = (obj: any, path: string, value: any) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
        } else {
            if (!current[key]) {
                current[key] = isNaN(Number(keys[index + 1])) ? {} : [];
            }
            current = current[key];
        }
    });
};
