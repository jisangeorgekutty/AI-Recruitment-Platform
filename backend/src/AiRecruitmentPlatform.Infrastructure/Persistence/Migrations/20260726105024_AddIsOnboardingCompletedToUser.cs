using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiRecruitmentPlatform.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsOnboardingCompletedToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_onboarding_completed",
                table: "users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "is_onboarding_completed", "password_hash" },
                values: new object[] { "05155fd9-8b0a-4593-8f59-546fe68342fa", false, "AQAAAAIAAYagAAAAEFV/9hwisXYWGUi1mTpMoMkyMuX7W2PR51vBM6MnGfIaypKt5jfWUJxormxDWlIcXw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_onboarding_completed",
                table: "users");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "concurrency_stamp", "password_hash" },
                values: new object[] { "045df1c6-b971-4ead-9761-d413235d05a6", "AQAAAAIAAYagAAAAEOD0nbHx0+P7kEO56nP+SbpMwqHZTbZS5p2v9lNzLIFtGT68W0g2AvGQXkPcGhoEBg==" });
        }
    }
}
