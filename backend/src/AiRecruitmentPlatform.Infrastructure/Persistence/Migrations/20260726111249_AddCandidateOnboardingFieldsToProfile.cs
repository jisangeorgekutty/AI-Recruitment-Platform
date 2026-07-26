using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateOnboardingFieldsToProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "expected_salary_max",
                table: "candidate_profile_informations",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "expected_salary_min",
                table: "candidate_profile_informations",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "experience_level",
                table: "candidate_profile_informations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "target_role",
                table: "candidate_profile_informations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "1ccd74a9-e8b6-4d25-aebe-942d19e5f7a8", "AQAAAAIAAYagAAAAEK6MwphwCo2eoggeigkpkGDRmo88ng121GMmK8TnboMgpZZcYDMdewu5kQadKSZXOQ==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "expected_salary_max",
                table: "candidate_profile_informations");

            migrationBuilder.DropColumn(
                name: "expected_salary_min",
                table: "candidate_profile_informations");

            migrationBuilder.DropColumn(
                name: "experience_level",
                table: "candidate_profile_informations");

            migrationBuilder.DropColumn(
                name: "target_role",
                table: "candidate_profile_informations");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "05155fd9-8b0a-4593-8f59-546fe68342fa", "AQAAAAIAAYagAAAAEFV/9hwisXYWGUi1mTpMoMkyMuX7W2PR51vBM6MnGfIaypKt5jfWUJxormxDWlIcXw==" });
        }
    }
}
