import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { CreateProfesorDto } from './dtos/create-profesor.dto';
import { UpdateProfesorDto } from './dtos/update-profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(Profesor)
    private readonly repo: Repository<Profesor>,
  ) {}

  private getPublicUrl(key: string | null) {
    if (!key) return null;

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async findFiltered(q: any) {
    const profesores = await this.repo.find();
    return profesores.map((p) => ({
      ...p,
      thumbnailUrlPublica: this.getPublicUrl(p.thumbnailKey),
    }));
  }

  async findOne(id: number) {
    const profesor = await this.repo.findOne({ where: { id } });
    if (!profesor) throw new NotFoundException();

    return {
      ...profesor,
      thumbnailUrlPublica: this.getPublicUrl(profesor.thumbnailKey),
    };
  }

  async create(dto: CreateProfesorDto) {
    const profesor = this.repo.create(dto);
    return this.repo.save(profesor);
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const profesor = await this.repo.findOne({ where: { id } });
    if (!profesor) throw new NotFoundException();

    Object.assign(profesor, dto);
    const saved = await this.repo.save(profesor);

    return {
      ...saved,
      thumbnailUrlPublica: this.getPublicUrl(saved.thumbnailKey),
    };
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
