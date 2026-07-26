using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase3_CandidatePortalAndResumes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "candidate_resumes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    candidate_profile_id = table.Column<long>(type: "bigint", nullable: false),
                    file_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    file_url = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    public_id = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    file_type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    file_size = table.Column<long>(type: "bigint", nullable: false),
                    is_primary = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    modified_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    modified_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    display_order = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_candidate_resumes", x => x.id);
                    table.ForeignKey(
                        name: "fk_candidate_resumes_candidate_profile_informations_candidate_p",
                        column: x => x.candidate_profile_id,
                        principalTable: "candidate_profile_informations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "candidate_saved_jobs",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    candidate_profile_id = table.Column<long>(type: "bigint", nullable: false),
                    job_posting_id = table.Column<long>(type: "bigint", nullable: false),
                    saved_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    modified_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    modified_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    display_order = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_candidate_saved_jobs", x => x.id);
                    table.ForeignKey(
                        name: "fk_candidate_saved_jobs_candidate_profile_informations_candidat",
                        column: x => x.candidate_profile_id,
                        principalTable: "candidate_profile_informations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_candidate_saved_jobs_job_postings_job_posting_id",
                        column: x => x.job_posting_id,
                        principalTable: "job_postings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "job_applications",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    job_posting_id = table.Column<long>(type: "bigint", nullable: false),
                    candidate_profile_id = table.Column<long>(type: "bigint", nullable: false),
                    candidate_resume_id = table.Column<long>(type: "bigint", nullable: true),
                    custom_resume_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    cover_letter = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    applied_date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    modified_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    modified_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    display_order = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_job_applications", x => x.id);
                    table.ForeignKey(
                        name: "fk_job_applications_candidate_profile_informations_candidate_pr",
                        column: x => x.candidate_profile_id,
                        principalTable: "candidate_profile_informations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_job_applications_candidate_resumes_candidate_resume_id",
                        column: x => x.candidate_resume_id,
                        principalTable: "candidate_resumes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_job_applications_job_postings_job_posting_id",
                        column: x => x.job_posting_id,
                        principalTable: "job_postings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "job_application_answers",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    job_application_id = table.Column<long>(type: "bigint", nullable: false),
                    job_screening_question_id = table.Column<long>(type: "bigint", nullable: false),
                    answer_text = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    created_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    modified_on = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    modified_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    display_order = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_job_application_answers", x => x.id);
                    table.ForeignKey(
                        name: "fk_job_application_answers_job_applications_job_application_id",
                        column: x => x.job_application_id,
                        principalTable: "job_applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_job_application_answers_job_screening_questions_job_screenin",
                        column: x => x.job_screening_question_id,
                        principalTable: "job_screening_questions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "d4307c6e-c288-467b-9ccb-8dda51666402", "AQAAAAIAAYagAAAAEK1mTbCiWeIYi7h29fs4QTyEksBZq61MAMIQcoQ3qm9bdYKnIl3sBty//h6LfOs/1A==" });

            migrationBuilder.CreateIndex(
                name: "ix_candidate_resumes_candidate_profile_id",
                table: "candidate_resumes",
                column: "candidate_profile_id");

            migrationBuilder.CreateIndex(
                name: "ix_candidate_saved_jobs_candidate_profile_id",
                table: "candidate_saved_jobs",
                column: "candidate_profile_id");

            migrationBuilder.CreateIndex(
                name: "ix_candidate_saved_jobs_job_posting_id",
                table: "candidate_saved_jobs",
                column: "job_posting_id");

            migrationBuilder.CreateIndex(
                name: "ix_job_application_answers_job_application_id",
                table: "job_application_answers",
                column: "job_application_id");

            migrationBuilder.CreateIndex(
                name: "ix_job_application_answers_job_screening_question_id",
                table: "job_application_answers",
                column: "job_screening_question_id");

            migrationBuilder.CreateIndex(
                name: "ix_job_applications_candidate_profile_id",
                table: "job_applications",
                column: "candidate_profile_id");

            migrationBuilder.CreateIndex(
                name: "ix_job_applications_candidate_resume_id",
                table: "job_applications",
                column: "candidate_resume_id");

            migrationBuilder.CreateIndex(
                name: "ix_job_applications_job_posting_id",
                table: "job_applications",
                column: "job_posting_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "candidate_saved_jobs");

            migrationBuilder.DropTable(
                name: "job_application_answers");

            migrationBuilder.DropTable(
                name: "job_applications");

            migrationBuilder.DropTable(
                name: "candidate_resumes");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "3584782f-084b-47f0-8c6b-544d7c8a16a0", "AQAAAAIAAYagAAAAENjlAJecB6CWZcpGvAURCjf1Nd5HFkpzxFJYoNVNJ/yeRzXNxY7tgIBqPBViML4zKg==" });
        }
    }
}
