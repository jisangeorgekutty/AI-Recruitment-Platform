using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddJobApplicationMatchScores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "job_application_match_scores",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    job_application_id = table.Column<long>(type: "bigint", nullable: false),
                    overall_match_percentage = table.Column<int>(type: "int", nullable: false),
                    skill_match_percentage = table.Column<int>(type: "int", nullable: false),
                    experience_match_percentage = table.Column<int>(type: "int", nullable: false),
                    matched_skills_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    missing_skills_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    candidate_ai_summary = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    recommendation_fit = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    evaluated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
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
                    table.PrimaryKey("pk_job_application_match_scores", x => x.id);
                    table.ForeignKey(
                        name: "fk_job_application_match_scores_job_applications_job_applicatio",
                        column: x => x.job_application_id,
                        principalTable: "job_applications",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "d2450143-16ce-48f4-a12e-0424796a6a22", "AQAAAAIAAYagAAAAEFYcmxfnt8mC6lEC/v/8ww+8mAmi+kNBpo2ArnPNqnbiJzMya5kNZ6zrZZRmbHd+HQ==" });

            migrationBuilder.CreateIndex(
                name: "ix_job_application_match_scores_job_application_id",
                table: "job_application_match_scores",
                column: "job_application_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "job_application_match_scores");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "408acbca-87bf-4452-9f78-5aadb8778cfd", "AQAAAAIAAYagAAAAELRTBUNGBClMToKKZD+rAUXIAVENzMiHS9c3XlpbmN7LjOHvfDq74ECm8R1s41Z5EA==" });
        }
    }
}
