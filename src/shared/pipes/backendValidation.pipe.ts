import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Eğer metatype geçerli bir sınıf değilse, işlem yapılmaz
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    // plainToInstance fonksiyonu metatype geçerli olduğunda çağrılır
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    // Eğer hata yoksa, değeri olduğu gibi döndür
    if (errors.length === 0) {
      return value;
    }

    // Hataları formatla ve doğru şekilde HTTP yanıtı oluştur
    throw new HttpException(
      { errors: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  // Hataları formatlayan fonksiyon
  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = error.constraints
        ? Object.values(error.constraints)
        : [];
      return acc;
    }, {});
  }

  // Geçerli metatype'ların kontrolü
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

// import {
//   ArgumentMetadata,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   PipeTransform,
//   ValidationError,
// } from '@nestjs/common';
// import { plainToClass, plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';
//
// @Injectable()
// export class BackendValidationPipe implements PipeTransform {
//   async transform(value: any, metadata: ArgumentMetadata) {
//     const object = plainToInstance(metadata.metatype, value);
//     const errors = await validate(object);
//     if (errors.length === 0) {
//       return value;
//     }
//     throw new HttpException(
//       { errors: this.formatErrors() },
//       HttpStatus.UNPROCESSABLE_ENTITY,
//     );
//   }
//   formatErrors(errors: ValidationError[]) {
//     return errors.reduce((acc, error) => {
//       acc[error.property] = Object.values(error.constraints);
//       return acc;
//     }, {});
//   }
// }
