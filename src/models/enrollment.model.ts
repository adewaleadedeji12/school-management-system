import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './student.model';
import { classes } from './class.model';

export const enrollmentStatusEnum = pgEnum('enrollment_status', [
  'active',
  'completed',
  'dropped',
  'transferred',
]);

export const enrollments = pgTable('enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  classId: uuid('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  academicYear: varchar('academic_year', { length: 20 }).notNull(),
  section: varchar('section', { length: 50 }),
  rollNumber: varchar('roll_number', { length: 50 }),
  status: varchar('status', { length: 50 }).default('active'),
  enrollmentDate: timestamp('enrollment_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
}));