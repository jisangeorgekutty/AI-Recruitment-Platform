using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRecruiterParsedResumes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "recruiter_parsed_resumes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    company_profile_id = table.Column<long>(type: "bigint", nullable: false),
                    recruiter_user_id = table.Column<long>(type: "bigint", nullable: false),
                    candidate_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    candidate_email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    candidate_phone = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    current_title = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    location = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    years_of_experience = table.Column<int>(type: "int", nullable: false),
                    summary = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    skills_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    work_history_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    education_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ats_overall_score = table.Column<int>(type: "int", nullable: false),
                    ats_keyword_score = table.Column<int>(type: "int", nullable: false),
                    ats_format_score = table.Column<int>(type: "int", nullable: false),
                    ats_completeness_score = table.Column<int>(type: "int", nullable: false),
                    ats_suggestions_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    original_file_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    document_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    parsed_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
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
                    table.PrimaryKey("pk_recruiter_parsed_resumes", x => x.id);
                    table.ForeignKey(
                        name: "fk_recruiter_parsed_resumes_company_profiles_company_profile_id",
                        column: x => x.company_profile_id,
                        principalTable: "company_profiles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "77f6246f-7758-4e78-a42c-a476c3b7f912", "AQAAAAIAAYagAAAAEEFEujrKY7tuTvAN4/k7K1lLRAip1jwv0T/bKVDxhrmHH5iJBvfvgfHp61SygAM1gg==" });

            migrationBuilder.CreateIndex(
                name: "ix_recruiter_parsed_resumes_company_profile_id",
                table: "recruiter_parsed_resumes",
                column: "company_profile_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "recruiter_parsed_resumes");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "d2450143-16ce-48f4-a12e-0424796a6a22", "AQAAAAIAAYagAAAAEFYcmxfnt8mC6lEC/v/8ww+8mAmi+kNBpo2ArnPNqnbiJzMya5kNZ6zrZZRmbHd+HQ==" });
        }
    }
}
