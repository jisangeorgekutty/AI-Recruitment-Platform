using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase3_AddAiResumeAtsAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "candidate_resume_analyses",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    candidate_resume_id = table.Column<long>(type: "bigint", nullable: false),
                    candidate_profile_id = table.Column<long>(type: "bigint", nullable: false),
                    overall_score = table.Column<int>(type: "int", nullable: false),
                    keyword_match_score = table.Column<int>(type: "int", nullable: false),
                    format_compatibility_score = table.Column<int>(type: "int", nullable: false),
                    section_completeness_score = table.Column<int>(type: "int", nullable: false),
                    suggestions_json = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    analyzed_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
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
                    table.PrimaryKey("pk_candidate_resume_analyses", x => x.id);
                    table.ForeignKey(
                        name: "fk_candidate_resume_analyses_candidate_profile_informations_can",
                        column: x => x.candidate_profile_id,
                        principalTable: "candidate_profile_informations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_candidate_resume_analyses_candidate_resumes_candidate_resume",
                        column: x => x.candidate_resume_id,
                        principalTable: "candidate_resumes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "408acbca-87bf-4452-9f78-5aadb8778cfd", "AQAAAAIAAYagAAAAELRTBUNGBClMToKKZD+rAUXIAVENzMiHS9c3XlpbmN7LjOHvfDq74ECm8R1s41Z5EA==" });

            migrationBuilder.CreateIndex(
                name: "ix_candidate_resume_analyses_candidate_profile_id",
                table: "candidate_resume_analyses",
                column: "candidate_profile_id");

            migrationBuilder.CreateIndex(
                name: "ix_candidate_resume_analyses_candidate_resume_id",
                table: "candidate_resume_analyses",
                column: "candidate_resume_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "candidate_resume_analyses");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "d4307c6e-c288-467b-9ccb-8dda51666402", "AQAAAAIAAYagAAAAEK1mTbCiWeIYi7h29fs4QTyEksBZq61MAMIQcoQ3qm9bdYKnIl3sBty//h6LfOs/1A==" });
        }
    }
}
