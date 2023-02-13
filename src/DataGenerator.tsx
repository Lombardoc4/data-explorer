import { faker } from '@faker-js/faker';
// import { faker } from '@faker-js/faker/locale/de';

type Plant = {
    commonName: string,
    scientificName: string,
    bloom:{
        color: string,
        time: string,
    },
    height: number,
    width: number,
    description: string,
    image: string, 
}

export const PLANTS: Plant[] = [];

export function createRandomPlant(): Plant {
  return {
    image:          faker.image.nature(),
    commonName:     faker.name.fullName(),
    scientificName: faker.name.fullName(),
    bloom:          {
                        color: faker.color.rgb(),
                        time:  faker.date.month(),
                    },
    height:         faker.datatype.number(720),
    width:          faker.datatype.number(600),
    description:    faker.lorem.lines(),
  };
}

Array.from({ length: 10 }).forEach(() => {
  PLANTS.push(createRandomPlant());
});