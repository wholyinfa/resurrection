interface data {
    name: string;
    age: number;
    address: string;
    vip: boolean;
    phone?: phone;
}
interface phone {
    model: string;
    brand: string;
    space: space;
    resolution: resolution;
}
interface space {
    size: number;
    unit: string;
}
interface resolution {
    size: number;
    unit: string;
}

const UserData = (data: data[]): void => {
    console.log(data);
}

UserData([
    {
        name: 'Yasmin',
        age: 22,
        address: 'Cat wifer Street 22, 2304 Caterson',
        vip: true
    }
]);